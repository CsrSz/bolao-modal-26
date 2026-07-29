create or replace function public.avaliar_palpite_oficial(
  p_palpite_mandante integer,
  p_palpite_visitante integer,
  p_resultado_mandante integer,
  p_resultado_visitante integer
)
returns table (
  pontos integer,
  regra_codigo text,
  regra_descricao text
)
language sql
immutable
security invoker
set search_path = public
as $$
  select
    case
      when p_resultado_mandante is null
        or p_resultado_visitante is null
        then null

      when p_palpite_mandante is null
        or p_palpite_visitante is null
        then 0

      when p_palpite_mandante = p_resultado_mandante
        and p_palpite_visitante = p_resultado_visitante
        then 10

      when p_resultado_mandante = p_resultado_visitante
        and p_palpite_mandante = p_palpite_visitante
        then 4

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
      and (
        p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
      )
        then 6

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
        then 4

      when p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
        then 2

      else 0
    end as pontos,

    case
      when p_resultado_mandante is null
        or p_resultado_visitante is null
        then case
          when p_palpite_mandante is null
            or p_palpite_visitante is null
            then 'NAO_INICIADO'
          else 'PENDENTE'
        end

      when p_palpite_mandante is null
        or p_palpite_visitante is null
        then 'SEM_PALPITE'

      when p_palpite_mandante = p_resultado_mandante
        and p_palpite_visitante = p_resultado_visitante
        then 'PLACAR_EXATO'

      when p_resultado_mandante = p_resultado_visitante
        and p_palpite_mandante = p_palpite_visitante
        then 'EMPATE_NAO_EXATO'

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
      and (
        p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
      )
        then 'VENCEDOR_E_UM_PLACAR'

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
        then 'ACERTOU_VENCEDOR'

      when p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
        then 'ACERTOU_GOLS_DE_UM_LADO'

      else 'SEM_ACERTO'
    end as regra_codigo,

    case
      when p_resultado_mandante is null
        or p_resultado_visitante is null
        then case
          when p_palpite_mandante is null
            or p_palpite_visitante is null
            then 'Jogo ainda não iniciado'
          else 'Palpite aguardando resultado'
        end

      when p_palpite_mandante is null
        or p_palpite_visitante is null
        then 'Participante não realizou o palpite'

      when p_palpite_mandante = p_resultado_mandante
        and p_palpite_visitante = p_resultado_visitante
        then 'Placar exato'

      when p_resultado_mandante = p_resultado_visitante
        and p_palpite_mandante = p_palpite_visitante
        then 'Empate correto com placar diferente'

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
      and (
        p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
      )
        then 'Vencedor correto e gols exatos de um dos lados'

      when (
        (
          p_resultado_mandante > p_resultado_visitante
          and p_palpite_mandante > p_palpite_visitante
        )
        or
        (
          p_resultado_mandante < p_resultado_visitante
          and p_palpite_mandante < p_palpite_visitante
        )
      )
        then 'Vencedor correto'

      when p_palpite_mandante = p_resultado_mandante
        or p_palpite_visitante = p_resultado_visitante
        then 'Gols exatos de um dos lados'

      else 'Nenhuma regra de pontuação atendida'
    end as regra_descricao;
$$;

grant execute
on function public.avaliar_palpite_oficial(integer, integer, integer, integer)
to anon, authenticated;