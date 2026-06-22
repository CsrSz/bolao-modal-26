async function entrar(event){

    event.preventDefault();

    const nome =
        document
            .getElementById('nome')
            .value
            .trim();

    const senha =
        document
            .getElementById('senha')
            .value;

    if(!nome){

        alert('Informe seu nome');
        return;

    }

    if(!senha){

        alert('Informe sua senha');
        return;

    }

    const { data, error } =
        await supabase
            .from('participantes')
            .select('*')
            .ilike('nome', nome);

    if(error){

        console.error(error);

        alert(
            'Erro ao acessar o banco'
        );

        return;

    }

    const participante =
        data.find(p =>

            p.nome.toLowerCase() ===
            nome.toLowerCase()

            &&

            p.senha === senha

        );

    if(!participante){

        alert(
            'Nome ou senha inválidos'
        );

        return;

    }

    localStorage.setItem(
        'usuarioLogado',
        participante.nome
    );

    localStorage.setItem(
        'usuarioId',
        participante.id
    );

    window.location.href =
        'palpites.html';

}