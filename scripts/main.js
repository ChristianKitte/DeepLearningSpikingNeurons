function runSimulation() {
    // Audiocontext, need a manual interaction within the Browser
    myAudioContext = new AudioContext();

    let primärTrain = dynamicImpulseTrain(
        rangeTgesamtValue,
        rangeTimpulseValue,
        rangeDtValue,
        rangeImaxValue,
        currentTypeValue
    );

    DrawGraph2("Diagramm1", primärTrain.U, primärTrain.U_out, primärTrain.I, primärTrain.T);


    let secundärTrain = dynamicVoltageTrain(
        rangeTgesamtValue,
        rangeDtValue,
        primärTrain.U_out
    );

    DrawGraph2("Diagramm2", secundärTrain.U, secundärTrain.U_out, secundärTrain.I, secundärTrain.T);
}




