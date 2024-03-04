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


//Função para atualizar os campos de entrada com informações do medicamento selecionado
function atualizarCamposMedicamento() {
    const medicamentoSelecionado = document.formulario.droga.value;
    const medicamento = medicamentos[medicamentoSelecionado];

    if (medicamento) {
        document.formulario.x_mg.value = medicamento.concentracao_massa;
        document.formulario.x_vol.value = medicamento.concentracao_vol;
        document.formulario.tamanho.value = medicamento.embalagem;

        // Define doses padrão para todos os medicamentos
        let doseMin = medicamento.dose_min_por_kg;
        let doseMax = medicamento.dose_max_por_kg;

        // Ajusta as doses para ibuprofenos específicos
        if (medicamentoSelecionado === 'ibuprofeno_50') {
            // A dose é baseada em gotas por kg diretamente
            doseMin = medicamento.gotas_por_kg_min; // 1 gota por kg
            doseMax = medicamento.gotas_por_kg_max; // 2 gotas por kg
        } else if (medicamentoSelecionado === 'ibuprofeno_100') {
            // A dose é metade do ibuprofeno_50
            doseMin = medicamento.gotas_por_kg_min / 2; // 0.5 gota por kg
            doseMax = medicamento.gotas_por_kg_max / 2; // 1 gota por kg
        }

        // Atualiza os campos de dose mínima e máxima
        document.formulario.dose_min.value = doseMin;
        document.formulario.dose_max.value = doseMax;
    }
}

function exibirDoseMaximaDiaria(pesoPaciente, medicamentoSelecionado) {
    const medicamento = medicamentos[medicamentoSelecionado];
    let doseMaximaDiariaTexto;

    if (medicamento) {
        
        if (medicamentoSelecionado === 'cefaclor') {
            const doseMaximaDiariaMg = Math.min(pesoPaciente * medicamento.maximo_diario_mg_por_kg, 1000); // Limita a 1g
            const doseMaximaDiariaMl = (doseMaximaDiariaMg / medicamento.concentracao_massa) * medicamento.concentracao_vol;
    
            doseMaximaDiariaTexto = `Dose máxima diária para Cefaclor: ${doseMaximaDiariaMl.toFixed(2)} mL.`;
        } else {
        // Para ibuprofeno, a dose máxima diária é calculada em gotas
        if (medicamentoSelecionado.includes('ibuprofeno')) {
            const doseMaximaDiariaGotas = (pesoPaciente * medicamento.maximo_diario_gotas_por_kg) / medicamento.administracoes_por_dia;
            doseMaximaDiariaTexto = `Dose máxima diária por tomada para ${medicamentoSelecionado}: ${doseMaximaDiariaGotas.toFixed(0)} gotas`;
        } else {
            // Para outros medicamentos, a dose máxima diária é calculada em mg
            const doseMaximaDiariaMg = (pesoPaciente * medicamento.maximo_diario_mg_por_kg);
            doseMaximaDiariaTexto = `Dose máxima diária por tomada para ${medicamentoSelecionado}: ${doseMaximaDiariaMg.toFixed(2)} mg`;
        }
    }
        document.getElementById('doseMaximaDiaria').textContent = doseMaximaDiariaTexto;
    }
  }


// Função para verificar frequencia maxima diaria.
function verificarFrequencia(medicamentoSelecionado, frequenciaSelecionada) {
    const medicamento = medicamentos[medicamentoSelecionado];
    if (parseInt(frequenciaSelecionada) > medicamento.administracoes_por_dia) {
        alert("Frequência incompatível com o medicamento selecionado.");
        return false; // Indica incompatibilidade
    }
    return true; // Indica compatibilidade
}
  // Função para calcular e exibir a dose
function calcularDose() {
    const pesoPaciente = parseFloat(document.formulario.peso.value);
    const medicamentoSelecionado = document.formulario.droga.value;
    const medicamento = medicamentos[medicamentoSelecionado];
    const frequenciaSelecionada = document.querySelector('input[name="dividida"]:checked').value;

    let frequenciaDescricao = "";
    let vezesPorDia;

    switch (frequenciaSelecionada) {
        case '1': frequenciaDescricao = "por tomada"; vezesPorDia = 1; break;
        case '2': frequenciaDescricao = "a cada 12 horas"; vezesPorDia = 2; break;
        case '3': frequenciaDescricao = "a cada 8 horas"; vezesPorDia = 3; break;
        case '4': frequenciaDescricao = "a cada 6 horas"; vezesPorDia = 4; break;
        default: frequenciaDescricao = "Verifique a frequência"; vezesPorDia = 0; break;
    }
    // Verifica se a frequência selecionada é compatível
    if (!verificarFrequencia(medicamentoSelecionado, frequenciaSelecionada)) {
        return; // Se a frequência não for compatível, retorna imediatamente
    }
    if (!pesoPaciente || pesoPaciente < 3 || pesoPaciente > 40) {
        alert("Por favor, insira um peso válido entre 3 e 40kg.");
        return;
    }

    if (medicamento) {
        let resultado;
        if (medicamentoSelecionado === 'cefaclor') {
            // Garante que a dose não exceda o máximo diário
            const doseTotalMg = Math.min(pesoPaciente * medicamento.dose_min_por_kg, 1000);
            const doseTotalMl = (doseTotalMg / medicamento.concentracao_massa) * medicamento.concentracao_vol;
            resultado = `Administrar ${doseTotalMl.toFixed(2)} mL por tomada, ${vezesPorDia} vezes ao dia.`;
        } else {
        if (medicamentoSelecionado.includes('ibuprofeno')) {
            const gotasPorTomadaMin = pesoPaciente * medicamento.gotas_por_kg_min;
            const gotasPorTomadaMax = pesoPaciente * medicamento.gotas_por_kg_max;
            resultado = `Administrar ${gotasPorTomadaMin.toFixed(0)} a ${gotasPorTomadaMax.toFixed(0)} gotas por tomada, ${vezesPorDia} vezes ao dia.`;
        } else {
            const dosePorTomadaMinMg = pesoPaciente * medicamento.dose_min_por_kg;
            const dosePorTomadaMaxMg = pesoPaciente * medicamento.dose_max_por_kg;
            const dosePorTomadaMinMl = (dosePorTomadaMinMg / medicamento.concentracao_massa) * medicamento.concentracao_vol;
            const dosePorTomadaMaxMl = (dosePorTomadaMaxMg / medicamento.concentracao_massa) * medicamento.concentracao_vol;
            resultado = `Administrar de ${dosePorTomadaMinMg.toFixed(0)}mg (${dosePorTomadaMinMl.toFixed(1)}ml) a ${dosePorTomadaMaxMg.toFixed(0)}mg (${dosePorTomadaMaxMl.toFixed(1)}ml) por tomada, ${vezesPorDia} vezes ao dia.`;
        }
     }
        document.formulario.prescricao_min.value = resultado;
        exibirDoseMaximaDiaria(pesoPaciente, medicamentoSelecionado);
        // No final da sua função calcularDose, antes de sair da função
        document.getElementById('copiarBtn').style.display = 'inline-block';

        
    }
}
document.getElementById('copiarBtn').addEventListener('click', copiarPrescricao);

async function copiarPrescricao() {
    const textoParaCopiar = document.getElementById('prescricao_min').value; // Assume que 'prescricao_min' é o id do elemento com o texto a ser copiado
    try {
        await navigator.clipboard.writeText(textoParaCopiar);
        alert("Prescrição copiada com sucesso!");
    } catch (err) {
        console.error("Falha ao copiar: ", err);
        alert("Erro ao copiar a prescrição.");
    }
}
// Adiciona ouvintes de evento
document.getElementById('copiarBtn').addEventListener('click', copiarPrescricao);

document.addEventListener('DOMContentLoaded', function() {
    document.formulario.peso.addEventListener('change', calcularDose);
    document.formulario.droga.addEventListener('change', function() {
        atualizarCamposMedicamento();
        // O cálculo é feito imediatamente após a seleção de um medicamento
        calcularDose();
    });
    // Esconde inicialmente o botão de copiar até que seja necessário
    document.getElementById('copiarBtn').style.display = 'none';
});

