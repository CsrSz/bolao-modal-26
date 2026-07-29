create or replace function public.auditoria_pontuacao(
  p_participante_id bigint default null
)
returns table (
  participante_id bigint,
  participante_nome text,
  jogo_id bigint,
  fase text,
  grupo text,
  rodada text,
  mandante text,
  visitante text,
  palpite_mandante integer,
  palpite_visitante integer,
  resultado_mandante integer,
  resultado_visitante integer,
  pontos integer,
  regra_codigo text,
  regra_descricao text,
  status_auditoria text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id::bigint as participante_id,
    p.nome::text as participante_nome,

    j.id::bigint as jogo_id,
    j.fase::text as fase,
    j.grupo::text as grupo,
    j.rodada::text as rodada,
    j.mandante::text as mandante,
    j.visitante::text as visitante,

    pal.mandante::integer as palpite_mandante,
    pal.visitante::integer as palpite_visitante,

    res.mandante::integer as resultado_mandante,
    res.visitante::integer as resultado_visitante,

    avaliacao.pontos,
    avaliacao.regra_codigo,
    avaliacao.regra_descricao,

    case
      when avaliacao.regra_codigo in ('PENDENTE', 'NAO_INICIADO')
        then 'AGUARDANDO_RESULTADO'

      when avaliacao.regra_codigo = 'SEM_PALPITE'
        then 'SEM_PALPITE'

      else 'AUDITADO'
    end::text as status_auditoria

  from public.participantes p

  cross join public.jogos j

  left join public.palpites pal
    on pal.participante_id = p.id
   and pal.jogo_id = j.id

  left join public.resultados res
    on res.jogo_id = j.id

  cross join lateral public.avaliar_palpite_oficial(
    pal.mandante,
    pal.visitante,
    res.mandante,
    res.visitante
  ) avaliacao

  where
    p_participante_id is null
    or p.id = p_participante_id

  order by
    p.nome,
    j.id;
$$;

grant execute
on function public.auditoria_pontuacao(bigint)
to anon, authenticated;