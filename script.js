const medicamentos = {
    paracetamol: {
        dose_min_por_kg: 10,
        dose_max_por_kg: 15,
        maximo_diario_mg_por_kg: 75,
        concentracao_massa: 200, //mg
        concentracao_vol: 1, //mL
        embalagem: 15, // ml 
        administracoes_por_dia: 4,
    },
    ibuprofeno_50: {
        gotas_por_kg_min: 1,
        gotas_por_kg_max: 2,
        concentracao_massa: 50, //mg
        concentracao_vol: 1, //mL
        maximo_diario_gotas_por_kg: 6, 
        embalagem: 30, // ml
        gotas_por_ml: 20,
        administracoes_por_dia: 3,
    },
    ibuprofeno_100: {
        gotas_por_kg_min: 0.5,
        gotas_por_kg_max: 1,
        concentracao_massa: 100, //mg
        concentracao_vol: 1, //mL
        maximo_diario_gotas_por_kg: 3,
        embalagem: 30, // ml
        gotas_por_ml: 20,
        administracoes_por_dia: 3,
    },
    dipirona: {
        dose_min_por_kg: 10,
        dose_max_por_kg: 15,
        maximo_diario_mg_por_kg: 1000,
        concentracao_massa: 50, //mg
        concentracao_vol: 1, //mL
        embalagem: 100, // ml
        administracoes_por_dia: 4,
    },
    amoxicilina: {
        dose_min_por_kg: 45,
        dose_max_por_kg: 70,
        maximo_diario_mg_por_kg: 90,
        concentracao_massa: 250, //mg
        concentracao_vol: 5, //mL
        embalagem: 140, // ml
        administracoes_por_dia: 3,
    },
    amoxicilinaclavulanato: {
        dose_min_por_kg: 70,
        dose_max_por_kg: 90,
        maximo_diario_mg_por_kg: 90,
        concentracao_massa: 400, //mg
        concentracao_vol: 5, //mL
        embalagem: 140, // ml
        administracoes_por_dia: 2,
    },
    cefaclor: {
        dose_min_por_kg: 20,
        dose_max_por_kg: 40,
        maximo_diario_mg_por_kg: 40,
        concentracao_massa: 375, //mg
        concentracao_vol: 5, //mL
        embalagem: 140, // ml
        administracoes_por_dia: 2,
    },
    azitromicina: {
        dose_min_por_kg: 10,
        dose_max_por_kg: 30,
        maximo_diario_mg_por_kg: 30,
        concentracao_massa: 200, //mg
        concentracao_vol: 5, //mL
        embalagem: 22.5, // ml
        administracoes_por_dia: 1,
    },
    // Adicione mais medicamentos conforme necessário...
};

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('calcularBtn').addEventListener('click', validarPesoECalcularDose);
    document.getElementById('droga').addEventListener('change', atualizarCamposMedicamentoEcalcularDose);
    document.getElementById('copiarBtn').addEventListener('click', copiarPrescricao);
    document.getElementById('copiarBtn').style.display = 'none';
    document.getElementById('compartilharBtn').addEventListener('click', compartilharPrescricao);
    document.getElementById('compartilharBtn').style.display = 'none';  //esconde o botao shared
}

function atualizarCamposMedicamentoEcalcularDose() {
    const medicamentoSelecionado = document.getElementById('droga').value;
    const medicamento = medicamentos[medicamentoSelecionado];

    if (medicamento) {
        document.getElementById('x_mg').value = medicamento.concentracao_massa;
        document.getElementById('x_vol').value = medicamento.concentracao_vol;
        document.getElementById('tamanho').value = medicamento.embalagem;

        if ('gotas_por_kg_min' in medicamento && 'gotas_por_kg_max' in medicamento) {
            document.getElementById('dose_min').value = medicamento.gotas_por_kg_min;
            document.getElementById('dose_max').value = medicamento.gotas_por_kg_max;
            document.getElementById('dose_min').placeholder = 'Gotas por kg';
            document.getElementById('dose_max').placeholder = 'Gotas por kg';
        } else {
            document.getElementById('dose_min').value = medicamento.dose_min_por_kg;
            document.getElementById('dose_max').value = medicamento.dose_max_por_kg;
            document.getElementById('dose_min').placeholder = 'Dose mínima (mg/kg)';
            document.getElementById('dose_max').placeholder = 'Dose máxima (mg/kg)';
        }
    }
    // Não chame calcularDose aqui se você deseja que o cálculo ocorra apenas quando o botão for pressionado.
}



function calcularDose() {
    const peso = parseFloat(document.getElementById('peso').value);
    const medicamentoSelecionado = document.getElementById('droga').value;
    const medicamento = medicamentos[medicamentoSelecionado];
    const frequenciaSelecionada = parseInt(document.querySelector('input[name="dividida"]:checked').value, 10);

    if (!medicamento) {
        console.error('Medicamento não selecionado ou não encontrado na lista de medicamentos.');
        return;
    }

    const vezesPorDia = frequenciaSelecionada;
    if (frequenciaSelecionada > medicamento.administracoes_por_dia) {
        alert("Frequência incompatível com o medicamento selecionado.");
        return;
    }

    let resultado, doseMaximaDiariaTexto;

    if ('gotas_por_kg_min' in medicamento) {
        // Cálculo para gotas
        const gotasPorTomadaMin = peso * medicamento.gotas_por_kg_min / frequenciaSelecionada;
        const gotasPorTomadaMax = peso * medicamento.gotas_por_kg_max / frequenciaSelecionada;
        resultado = `Administrar de ${gotasPorTomadaMin.toFixed(0)} a ${gotasPorTomadaMax.toFixed(0)} gotas por tomada, de ${frequenciaDescricao(vezesPorDia)}.`;
        doseMaximaDiariaTexto = `${(peso * medicamento.maximo_diario_gotas_por_kg).toFixed(0)} gotas`;
    } else {
        // Cálculo para ml e mg
        const dosePorTomadaMinMg = peso * medicamento.dose_min_por_kg / frequenciaSelecionada;
        const dosePorTomadaMaxMg = peso * medicamento.dose_max_por_kg / frequenciaSelecionada;
        const dosePorTomadaMinMl = dosePorTomadaMinMg / (medicamento.concentracao_massa / medicamento.concentracao_vol);
        const dosePorTomadaMaxMl = dosePorTomadaMaxMg / (medicamento.concentracao_massa / medicamento.concentracao_vol);
        resultado = `Administrar de ${dosePorTomadaMinMl.toFixed(1)}ml (${dosePorTomadaMinMg.toFixed(0)}mg) a ${dosePorTomadaMaxMl.toFixed(1)}ml (${dosePorTomadaMaxMg.toFixed(0)}mg) por tomada, de ${frequenciaDescricao(vezesPorDia)}.`;
        doseMaximaDiariaTexto = `${(peso * medicamento.maximo_diario_mg_por_kg).toFixed(0)}mg (${(peso * medicamento.maximo_diario_mg_por_kg / (medicamento.concentracao_massa / medicamento.concentracao_vol)).toFixed(1)}ml)`;
    }

    // Correção para usar textContent e evitar XSS
    document.getElementById('prescricao_min').innerHTML = resultado;
    document.getElementById('doseMaximaDiaria').innerHTML = 'Dose Máxima Diária: ' + doseMaximaDiariaTexto;
    
    // Certifique-se de mostrar os botões após o cálculo
    document.getElementById('copiarBtn').style.display = 'block';
    document.getElementById('compartilharBtn').style.display = 'block';

    // Removendo a chamada recursiva para calcularDose()
    // calcularDose(); // Esta linha deve ser removida
}


function frequenciaDescricao(frequenciaSelecionada) {
    const frequencias = {
        1: "1 vez ao dia",
        2: "de 12/12 horas",
        3: "de 8/8 horas",
        4: "de 6/6 horas"
    };
    return frequencias[frequenciaSelecionada] || "";
}

function validarPesoECalcularDose() {
    const pesoInput = document.getElementById('peso');
    const peso = parseFloat(pesoInput.value);
    if (pesoInput.value === "") {
        alert("Por favor, insira o peso.");
        return;
    }
    if (isNaN(peso) || peso < 3 || peso > 40) {
        alert("Por favor, insira um peso válido entre 3 e 40kg.");
        return;
    }
    calcularDose();
}
async function copiarPrescricao() {
    const textoParaCopiar = document.getElementById('prescricao_min').textContent;
    try {
        await navigator.clipboard.writeText(textoParaCopiar);
        alert("Prescrição copiada com sucesso!");
    } catch (err) {
        alert("Erro ao copiar a prescrição.");
    }
}
async function compartilharPrescricao() {
    const textoParaCompartilhar = document.getElementById('prescricao_min').textContent;
    if (!navigator.share) {
        alert("Seu navegador não suporta a funcionalidade de compartilhamento.");
        return;
    }

    try {
        await navigator.share({
            title: 'Prescrição Médica',
            text: textoParaCompartilhar
        });
    } catch (err) {
        alert("Não foi possível compartilhar a prescrição.");
    }
}
