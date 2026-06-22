function calcularPontos(pm, pv, rm, rv){

    pm = Number(pm);
    pv = Number(pv);
    rm = Number(rm);
    rv = Number(rv);

    const acertouMandante =
        pm === rm;

    const acertouVisitante =
        pv === rv;

    const acertouUmLado =
        acertouMandante ||
        acertouVisitante;

    const resultado =
        Math.sign(rm - rv);

    const palpite =
        Math.sign(pm - pv);

    const acertouResultado =
        resultado === palpite;

    if(
        acertouMandante &&
        acertouVisitante
    ){
        return 10;
    }

    if(
        acertouResultado &&
        acertouUmLado
    ){
        return 6;
    }

    if(acertouResultado){
        return 4;
    }

    if(acertouUmLado){
        return 2;
    }

    return 0;
}