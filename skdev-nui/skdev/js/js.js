function funcaofechar() {
    const intervaloOpacidade = setInterval(function() {
        const opacity = $(".administracao").css("opacity");

        if (parseFloat(opacity) >= 1) {
            clearInterval(intervaloOpacidade);
            $('.administracao').stop().fadeOut(1000);
            $.post(`https://${GetParentResourceName()}/close`, JSON.stringify({}), (data) => {});
        }
    }, 100);
}

function notificacaoLocal(aviso) {
    if ($(".notificacaousuario").css("display") === "none") {
        $(".notificacaousuario h2").html(aviso);
        $(".notificacaousuario").css("display","flex");
        
        const notificacao = $(".notificacaousuario")
        
        notificacao.one("animationend", function(event) {
            if (event.originalEvent.animationName === "notificacaousuarioAparecer") {
                $(".notificacaousuario").css("display","none");
            }
        });
    }
}

function GerenciarMenu(menu) {
    if (menu) {
        if (menu === "GerenciarPlayers") {
            $.post(`https://${GetParentResourceName()}/cidadoesinformacoes`, JSON.stringify({}), (data) => {
                $(".menu2").html("");
    
                $(".menu2").css("animation","none");
                void $(".menu2")[0].offsetWidth;
                $(".menu2").css("animation","menu2aparecer 2s forwards");
    
                $(".botao_menu1").removeAttr("menuativo");
                $(".buttonmenu2").attr("menuativo","");

                $(".menu2").html(`
                <div class="consultarinformacoesplayer">
                    <h2>SELECIONE ALGUMA OPÇÃO</h2>
                    <div class="tipodeopcao">
                        <button>GARAGEM</button>
                        <button>INVENTÁRIO</button>
                    </div>
                </div>

                <div class="consultarinformacaoplayer2">
                    <h2>GARAGEM DO PLAYER</h2>
                    <div class="containerinformacaoplayer">
                    </div>
                    <button class="fecharconsul" onclick="fecharConsultar2()">VOLTAR</button>
                </div>

                <div class="gerenciamentoinformacaoplayer">
                    <h2 class="info_nomeh2">NOME</h2>
                    <img src="./skdev/img/edit.png" draggable="false" class="info_nomeimg">
                    <h3 class="info_nomeh3">ERICK SILVA MOREIRA BORGES</h3>

                    <h2 class="info_telefoneh2">TELEFONE</h2>
                    <img src="./skdev/img/edit.png" draggable="false" class="info_telefoneimg">
                    <h3 class="info_telefoneh3">7777-7777</h3>

                    <h2 class="info_registroh2">REGISTRO</h2>
                    <img src="./skdev/img/edit.png" draggable="false" class="info_registroimg">
                    <h3 class="info_registroh3">OZ2DJKBD</h3>

                    <h2 class="info_carteirah2">CARTEIRA</h2>
                    <img src="./skdev/img/edit.png" draggable="false" class="info_carteiraimg">
                    <h3 class="info_carteirah3">1,000,000,000,000,000,000,000,000,000 $</h3>

                    <h2 class="info_bancoh2">BANCO</h2>
                    <img src="./skdev/img/edit.png" draggable="false" class="info_bancoimg">
                    <h3 class="info_bancoh3">1,000,000,000,000,000,000,000,000,000 $</h3>

                    <button class="aplicarkickbutton">APLICAR KICK</button>
                    <button class="aplicarbanbutton">APLICAR BAN</button>
                    <button class="aplicaradvbutton">APLICAR ADV</button>
                    <button class="fechargerenciarbutton">FECHAR</button>
                </div>

                <div class="digitacaogerenciamento">
                    <h2>DIGITE O MOTIVO DO BAN</h2>
                    <input type="text">
                    <div class="botoesdig">
                        <button class="botaodiv_voltar">VOLTAR</button>
                        <button class="botaodiv_confirmar">CONFIRMAR</button>
                    </div>
                </div>

                <div class="gerenciarplayersdiv">
                    <h3>GERENCIAMENTO DE PLAYERS</h3>

                    <input type="text" placeholder="Nome | ID | Offline" oninput="procurarInfoPlayers()" class="inputinfoplayers">

                    <div class="containergerenciarplayers">
                    </div>
                </div>
                `);

                $(".nomedoadm h2").html(data.nome)
                $(".cargodoadm h2").html(data.cargo)

                const tabela = data.tabela;
                tabela.forEach((texto,index) => {
                    const append = `
                    <div class="gerenciarplayerdiv">
                        <h2>#${texto.passaporte}</h2>
                        <h3>${texto.nome}</h3>
                        <h4 ${texto.nomestatus}>${texto.status}</h4>
                        <button class="informacoesgerenciarplayer" onclick="informacoesCidadao(${texto.passaporte})">INFORMAÇÕES</button>
                        <button class="gerenciamentogerenciarplayer" onclick="gerenciarCidadao(${texto.passaporte})">GERENCIAMENTO</button>
                    </div>
                    `

                    $(".containergerenciarplayers").append(append)
                });
            })
        }
        if (menu === "Punicoes") {
            $.post(`https://${GetParentResourceName()}/cidadoespunicoesinformacoes`, JSON.stringify({}), (data) => {
                $(".menu2").html("");
    
                $(".menu2").css("animation","none");
                void $(".menu2")[0].offsetWidth;
                $(".menu2").css("animation","menu2aparecer 2s forwards");
    
                $(".botao_menu1").removeAttr("menuativo");
                $(".buttonmenu3").attr("menuativo","");

                fecharmodal2()
                $(".menu2").html(`
                <div class="gerenciarplayersdiv">
					<h3>GERENCIAMENTO DE PUNIÇÕES</h3>

					<input type="text" placeholder="Nome | ID | Advertência" oninput="procurarInfoPunicoes()" class="inputinfopunicoes">

					<div class="containergerenciarplayers">
					</div>
				</div>
                `);

                $(".containergerenciarplayers").html("")
                const tabela = data.tabela;
                tabela.forEach((texto,index) => {
                    if (texto.punicao <= 3) {
                        const append = `
                        <div class="gerenciarplayerdiv">
                            <h2>#${texto.passaporte}</h2>
                            <h3>${texto.nome}</h3>
                            <h4>${texto.punicao} ADVERTÊNCIA</h4>
                            <button class="informacoesgerenciarplayer2" onclick="informacaoPuni(${texto.passaporte},'${texto.punicao}')">INFORMAÇÕES</button>
                            <button class="removergerenciarplayer2" onclick="removerPuni(${texto.passaporte},'${texto.punicao}')">REMOVER</button>
                        </div>
                        `
    
                        $(".containergerenciarplayers").append(append)
                    } else {
                        const append = `
                        <div class="gerenciarplayerdiv">
                            <h2>#${texto.passaporte}</h2>
                            <h3>${texto.nome}</h3>
                            <h4>${texto.punicao}</h4>
                            <button class="informacoesgerenciarplayer2" onclick="informacaoPuni(${texto.passaporte},'${texto.punicao}')">INFORMAÇÕES</button>
                            <button class="removergerenciarplayer2" onclick="removerPuni(${texto.passaporte},'${texto.punicao}')">REMOVER</button>
                        </div>
                        `
    
                        $(".containergerenciarplayers").append(append)
                    }
                });
            })
        }
        if (menu === "Inventario") {
            $.post(`https://${GetParentResourceName()}/inventariodacidadeinformacoes`, JSON.stringify({}), (data) => {
                $(".menu2").html("");

                $(".menu2").css("animation","none");
                void $(".menu2")[0].offsetWidth;

                fecharmodal2()
                $(".menu2").html(`
                <div class="digitacaogerenciamento"></div>

                <div class="gerenciarplayersdiv">
					<h3>GERENCIAMENTO DE ITENS</h3>

					<input type="text" placeholder="Nome do item" oninput="procurarInfoInventarioCidade()" class="inputinfoinventcidade">

					<div class="containerdivshorizontais">
					</div>
				</div>
                `);

                $(".containerdivshorizontais").html("")

                const tabela = data.tabela;
                const imagen = data.imagen;
                tabela.forEach((texto,index) => {
                    const append = `
                    <div class="itemplayerdiv">
                        <div class="itemdiv">
                            <h2>${texto.itempainel}</h2>
                            <img src="${imagen}/${texto.index}.png" draggable="false">
                        </div>
                        <button class="enviaritembutton" onclick="enviaritemparaCidadao('${texto.item}')">ENVIAR ITEM <img src="./skdev/img/send.png" draggable="false"></button>
                        <button class="pegaritembutton" onclick="pegaritemStaff('${texto.item}')">PEGAR ITEM <img src="./skdev/img/hand.png" draggable="false"></button>
                    </div>
                    `

                    $(".containerdivshorizontais").append(append)
                });

                $(".menu2").css("animation","menu2aparecer 2s forwards");
    
                $(".botao_menu1").removeAttr("menuativo");
                $(".buttonmenu4").attr("menuativo","");
            })
        }
        if (menu === "Veiculos") {
            $.post(`https://${GetParentResourceName()}/veiculosdacidadeinformacoes`, JSON.stringify({}), (data) => {
                $(".menu2").html("");
    
                $(".menu2").css("animation","none");
                void $(".menu2")[0].offsetWidth;
    
                fecharmodal2()
                $(".menu2").html(`
                <div class="digitacaogerenciamento"></div>
    
                <div class="gerenciarplayersdiv">
                    <h3>GERENCIAMENTO DE VEICULO</h3>
    
                    <input type="text" placeholder="NOME DO VEICULO" oninput="procurarInfoVeiculosCidade()" class="inputinfoveiculoscidade">
    
                    <div class="containerdivshorizontais">
                    </div>
                </div>
                `);
    
                $(".containerdivshorizontais").html("")
    
                const tabela = data.tabela;
                const imagen = data.imagen;
                tabela.forEach((texto,index) => {
                    const append = `
                    <div class="itemplayerdiv">
                        <div class="itemdiv">
                            <h2>${texto.veiculopainel}</h2>
                            <img src="${imagen}/${texto.veiculo}.png" draggable="false">
                        </div>
                        <button class="enviaritembutton" onclick="enviarveiculoCidadao('${texto.veiculo}')">ENVIAR VEICULO <img src="./skdev/img/send.png" draggable="false"></button>
                    </div>
                    `
    
                    $(".containerdivshorizontais").append(append)
                });
    
                $(".menu2").css("animation","menu2aparecer 2s forwards");
    
                $(".botao_menu1").removeAttr("menuativo");
                $(".buttonmenu5").attr("menuativo","");
            })
        }
    }
};

function informacoesCidadao(passaporte) {
    $(".consultarinformacoesplayer").css("display","none")

    $(".consultarinformacoesplayer").html(`
    <h2>SELECIONE ALGUMA OPÇÃO</h2>
    <div class="tipodeopcao">
        <button onclick="informacaoGaragem(${passaporte})">GARAGEM</button>
        <button onclick="informacaoInventario(${passaporte})">INVENTÁRIO</button>
    </div>
    <button class="fecharconsul" onclick="fecharInfoCidadao()">FECHAR</button>
    `)

    $(".consultarinformacoesplayer").fadeIn(700)
    $(".consultarinformacoesplayer").css("display","flex")
}

function informacaoGaragem(passaporte) {
    $.post(`https://${GetParentResourceName()}/informacaoGaragem`, JSON.stringify({passaporte: passaporte}), (data) => {
        $(".consultarinformacoesplayer").fadeOut(700)
        $(".consultarinformacaoplayer2").css("display","none")
        $(".consultarinformacaoplayer2").html(`
            <h2>GARAGEM DO PLAYER</h2>
            <div class="containerinformacaoplayer">
            </div>
            <button class="fecharconsul" onclick="voltarConsultar2(${passaporte})">VOLTAR</button>
        `)
        $(".containerinformacaoplayer").html("")

        const imagen = data.imagen
        
        const tabela = data.tabela
        tabela.forEach((texto,index) => {
            const append = `
            <div class="informacaoplayerdiv">
                <h2>${texto.veiculopainel}</h2>
                <img src="${imagen}/${texto.veiculo}.png" draggable="false">
                <button onclick="removerVeiculoPlayer(${passaporte},'${texto.veiculo}')">REMOVER</button>
            </div>
            `
            
            $(".containerinformacaoplayer").append(append)
        });

        $(".consultarinformacaoplayer2").fadeIn(700)
        $(".consultarinformacaoplayer2").css("display","flex")
    });
}

function removerVeiculoPlayer(passaporte,veiculo) {
    $.post(`https://${GetParentResourceName()}/removerVeiculoPlayer`, JSON.stringify({passaporte: passaporte, veiculo: veiculo}), (data) => {
        if (data.status) {
            informacaoGaragem(passaporte)
            notificacaoLocal("Você removeu o veiculo com sucesso!")
        } else {
            notificacaoLocal("Parece que deu algum erro!")
        }
    });
}

function voltarConsultar2(passaporte) {
    $(".consultarinformacaoplayer2").fadeOut(700)
    informacoesCidadao(passaporte)
}

function fecharInfoCidadao() {
    $(".consultarinformacoesplayer").fadeOut(700)
}

function informacaoInventario(passaporte) {
    $.post(`https://${GetParentResourceName()}/informacaoInventario`, JSON.stringify({passaporte: passaporte}), (data) => {
        $(".consultarinformacoesplayer").fadeOut(700)
        $(".consultarinformacaoplayer2").css("display","none")
        $(".consultarinformacaoplayer2").html(`
            <h2>INVENTÁRIO DO PLAYER</h2>
            <div class="containerinformacaoplayer">
            </div>
            <button class="fecharconsul" onclick="voltarConsultar2(${passaporte})">VOLTAR</button>
        `)
        $(".containerinformacaoplayer").html("")

        const imagen = data.imagen
        
        const tabela = data.tabela
        tabela.forEach((texto,index) => {
            const append = `
            <div class="informacaoplayerdiv">
                <h2>${texto.nomedoitem}</h2>
                <h3>${texto.quantidadedoitem}x</h3>
                <img src="${imagen}/${texto.item}.png" draggable="false">
                <button onclick="removerItemPlayer(${passaporte},'${texto.item}',${texto.slot},${texto.quantidadedoitem})">REMOVER</button>
            </div>
            `
            
            $(".containerinformacaoplayer").append(append)
        });

        $(".consultarinformacaoplayer2").fadeIn(700)
        $(".consultarinformacaoplayer2").css("display","flex")
    });
}

function removerItemPlayer(passaporte,item,slot,quantidadedoitem) {
    $.post(`https://${GetParentResourceName()}/removerItemPlayer`, JSON.stringify({passaporte: passaporte, item: item, slot: slot, amount: quantidadedoitem}), (data) => {
        if (data.status) {
            informacaoInventario(passaporte)
            notificacaoLocal("Você removeu o item do player com sucesso!")
        } else {
            notificacaoLocal("Parece que deu algum erro!")
        }
    });
}

function fecharmodal2() {
    $(".menumodal2").fadeOut(1000)
}

function gerenciarCidadao(passaporte) {
    $.post(`https://${GetParentResourceName()}/informacaoCidadao`, JSON.stringify({passaporte: passaporte}), (data) => {
        $(".consultarinformacoesplayer").fadeOut(700)
        $(".consultarinformacaoplayer2").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
    
        $(".gerenciamentoinformacaoplayer").fadeOut(700)

        const tabela = data.tabela
        $(".gerenciamentoinformacaoplayer").html(`
            <h2 class="info_nomeh2">NOME</h2>
            <img src="./skdev/img/edit.png" draggable="false" class="info_nomeimg" onclick="editarCidadao(${passaporte},'NOME')">
            <h3 class="info_nomeh3">${tabela.nome}</h3>

            <h2 class="info_telefoneh2">TELEFONE</h2>
            <img src="./skdev/img/edit.png" draggable="false" class="info_telefoneimg" onclick="editarCidadao(${passaporte},'TELEFONE')">
            <h3 class="info_telefoneh3">${tabela.telefone}</h3>

            <h2 class="info_registroh2">REGISTRO</h2>
            <img src="./skdev/img/edit.png" draggable="false" class="info_registroimg" onclick="editarCidadao(${passaporte},'REGISTRO')">
            <h3 class="info_registroh3">${tabela.registro}</h3>

            <h2 class="info_carteirah2">CARTEIRA</h2>
            <img src="./skdev/img/edit.png" draggable="false" class="info_carteiraimg" onclick="editarCidadao(${passaporte},'CARTEIRA')">
            <h3 class="info_carteirah3">${tabela.carteira} $</h3>

            <h2 class="info_bancoh2">BANCO</h2>
            <img src="./skdev/img/edit.png" draggable="false" class="info_bancoimg" onclick="editarCidadao(${passaporte},'BANCO')">
            <h3 class="info_bancoh3">${tabela.banco} $</h3>

            <button class="aplicarkickbutton" onclick="aplicarKick(${passaporte})">APLICAR KICK</button>
            <button class="aplicarbanbutton" onclick="aplicarBan(${passaporte})">APLICAR BAN</button>
            <button class="aplicaradvbutton"onclick="aplicarADV(${passaporte})" >APLICAR ADV</button>
            <button class="fechargerenciarbutton"onclick="fecharGerenciamento()" >FECHAR</button>
        `)

        $(".gerenciamentoinformacaoplayer").fadeIn(700)
        $(".gerenciamentoinformacaoplayer").css("display","flex")
    });
}

function editarCidadao(passaporte,tipo) {
    if (tipo === "NOME") {
        $(".gerenciamentoinformacaoplayer").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
        
        $(".digitacaogerenciamento").html(`
        <h2>DIGITE O NOVO NOME</h2>
        <input type="text" class="valorinputcidadao valornome">
        <h2>DIGITE O NOVO SOBRENOME</h2>
        <input type="text" class="valorinputcidadao valorsobrenome">
        <div class="botoesdig">
            <button class="botaodiv_voltar" onclick="gerenciarCidadao(${passaporte})">VOLTAR</button>
            <button class="botaodiv_confirmar" onclick="confirmarCidadao(${passaporte},'${tipo}')">CONFIRMAR</button>
        </div>
        `)

        $(".digitacaogerenciamento").fadeIn(700)
        $(".digitacaogerenciamento").css("display","flex")
    }
    if (tipo === "TELEFONE") {
        $(".gerenciamentoinformacaoplayer").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
        
        $(".digitacaogerenciamento").html(`
        <h2>DIGITE O NOVO TELEFONE</h2>
            <input type="text" class="valorinputcidadao">
            <div class="botoesdig">
            <button class="botaodiv_voltar" onclick="gerenciarCidadao(${passaporte})">VOLTAR</button>
            <button class="botaodiv_confirmar" onclick="confirmarCidadao(${passaporte},'${tipo}')">CONFIRMAR</button>
        </div>
        `)

        $(".digitacaogerenciamento").fadeIn(700)
        $(".digitacaogerenciamento").css("display","flex")
    }
    if (tipo === "REGISTRO") {
        $(".gerenciamentoinformacaoplayer").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
        
        $(".digitacaogerenciamento").html(`
        <h2>DIGITE O NOVO REGISTRO</h2>
            <input type="text" class="valorinputcidadao">
            <div class="botoesdig">
            <button class="botaodiv_voltar" onclick="gerenciarCidadao(${passaporte})">VOLTAR</button>
            <button class="botaodiv_confirmar" onclick="confirmarCidadao(${passaporte},'${tipo}')">CONFIRMAR</button>
        </div>
        `)

        $(".digitacaogerenciamento").fadeIn(700)
        $(".digitacaogerenciamento").css("display","flex")
    }
    if (tipo === "CARTEIRA") {
        $(".gerenciamentoinformacaoplayer").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
        
        $(".digitacaogerenciamento").html(`
        <h2>DIGITE O NOVO VALOR DA CARTEIRA</h2>
        <input type="text" class="valorinputcidadao">
        <div class="botoesdig">
            <button class="botaodiv_voltar" onclick="gerenciarCidadao(${passaporte})">VOLTAR</button>
            <button class="botaodiv_confirmar" onclick="confirmarCidadao(${passaporte},'${tipo}')">CONFIRMAR</button>
        </div>
        `)

        $(".digitacaogerenciamento").fadeIn(700)
        $(".digitacaogerenciamento").css("display","flex")
    }
    if (tipo === "BANCO") {
        $(".gerenciamentoinformacaoplayer").fadeOut(700)
        $(".digitacaogerenciamento").fadeOut(700)
        
        $(".digitacaogerenciamento").html(`
        <h2>DIGITE O NOVO VALOR DO BANCO</h2>
            <input type="text" class="valorinputcidadao">
            <div class="botoesdig">
            <button class="botaodiv_voltar" onclick="gerenciarCidadao(${passaporte})">VOLTAR</button>
            <button class="botaodiv_confirmar" onclick="confirmarCidadao(${passaporte},'${tipo}')">CONFIRMAR</button>
        </div>
        `)

        $(".digitacaogerenciamento").fadeIn(700)
        $(".digitacaogerenciamento").css("display","flex")
    }
}

function confirmarCidadao(passaporte,tipo) {
    const valor = $(".valorinputcidadao").val()
    
    const nome = $(".valornome").val()
    const sobrenome = $(".valorsobrenome").val()
    if (nome != undefined) {
        if (nome.length > 0 || sobrenome.length > 0) {
            $.post(`https://${GetParentResourceName()}/alterarNome`, JSON.stringify({passaporte: passaporte, nome: nome, sobrenome: sobrenome}), (data) => {
                const status = data.status
        
                if (status) {
                    gerenciarCidadao(passaporte)
                }
            })
        }
    }

    $.post(`https://${GetParentResourceName()}/confirmarCidadao`, JSON.stringify({passaporte: passaporte, tipo: tipo, valor: valor}), (data) => {
        const status = data.status

        if (status) {
            gerenciarCidadao(passaporte)
        }
    })
}

function fecharGerenciamento() {
    $(".gerenciamentoinformacaoplayer").fadeOut(700)
}

function fecharDigitacao() {
    $(".gerenciamentoinformacaoplayer").fadeOut(700)
    $(".digitacaogerenciamento").fadeOut(700)
}

function aplicarKick(passaporte) {
    $(".gerenciamentoinformacaoplayer").fadeOut(700)
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE O MOTIVO DO KICK</h2>
    <input type="text" class="valorinputcidadao">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarKick(${passaporte})">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarKick(passaporte) {
    const motivo = $(".valorinputcidadao").val()

    $.post(`https://${GetParentResourceName()}/confirmarKick`, JSON.stringify({passaporte: passaporte, motivo: motivo}), (data) => {
        const status = data.status

        if (status) {
            fecharDigitacao()
        }
    })
}

function aplicarBan(passaporte) {
    $(".gerenciamentoinformacaoplayer").fadeOut(700)
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE O MOTIVO DO BAN</h2>
    <input type="text" class="valorinputcidadao">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarBan(${passaporte})">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarBan(passaporte) {
    const motivo = $(".valorinputcidadao").val()

    $.post(`https://${GetParentResourceName()}/confirmarBan`, JSON.stringify({passaporte: passaporte, motivo: motivo}), (data) => {
        const status = data.status

        if (status) {
            fecharDigitacao()
        }
    })
}

function aplicarADV(passaporte) {
    $(".gerenciamentoinformacaoplayer").fadeOut(700)
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE O MOTIVO DA ADVERTÊNCIA</h2>
    <input type="text" class="valorinputcidadao">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarADV(${passaporte})">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarADV(passaporte) {
    const motivo = $(".valorinputcidadao").val()
    
    $.post(`https://${GetParentResourceName()}/confirmarADV`, JSON.stringify({passaporte: passaporte, motivo: motivo}), (data) => {
        const status = data.status

        if (status) {
            fecharDigitacao()
        }
    })
}

function procurarInfoPlayers() {
    const searchText = $(".inputinfoplayers").val().toLowerCase();
    $(".gerenciarplayerdiv").each(function() {
        const h2Text = $(this).find("h2").text().toLowerCase();
        const h3Text = $(this).find("h3").text().toLowerCase();
        const h4Text = $(this).find("h4").text().toLowerCase();
      
        if (
            h2Text.includes(searchText) ||
            h3Text.includes(searchText) ||
            h4Text.includes(searchText)
        ) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function informacaoPuni(passaporte,punicao) {
    $.post(`https://${GetParentResourceName()}/receberInformacaoPuni`, JSON.stringify({passaporte: passaporte, punicao: punicao}), (data) => {
        $(".menumodal2").fadeOut(700)

        const tabela = data.tabela;
        $(".menumodal2").html(`
        <div class="divmodal2">
            <h2>ID DO STAFF</h2>
            <h4>${tabela.passaporte}</h4>
        </div>
        <div class="divmodal2">
            <h2>NOME DO STAFF</h2>
            <h4>${tabela.nomedostaff}</h4>
        </div>
        <div class="divmodal2">
            <h2>DATA DA PUNIÇÃO</h2>
            <h4>${tabela.data}</h4>
        </div>
        <div class="divmodal2">
            <h2>MOTIVO DA PUNIÇÃO</h2>
            <h3>${tabela.motivo}</h3>
        </div>

        <button onclick="fecharmodal2()">FECHAR</button>
        `)

        $(".menumodal2").fadeIn(700)
        $(".menumodal2").css("display","flex")
    })
}

function removerPuni(passaporte,motivo) {
    $.post(`https://${GetParentResourceName()}/removerPuni`, JSON.stringify({passaporte: passaporte, punicao: motivo}), (data) => {
        const status = data.status

        if (status) {
            GerenciarMenu("Punicoes")
        }
    })
}

function procurarInfoPunicoes() {
    const searchText = $(".inputinfopunicoes").val().toLowerCase();
    $(".gerenciarplayerdiv").each(function() {
        const h2Text = $(this).find("h2").text().toLowerCase();
        const h3Text = $(this).find("h3").text().toLowerCase();
        const h4Text = $(this).find("h4").text().toLowerCase();
      
        if (
            h2Text.includes(searchText) ||
            h3Text.includes(searchText) ||
            h4Text.includes(searchText)
        ) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function enviaritemparaCidadao(item) {
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE O ID DO CIDADÃO</h2>
    <input type="text" class="valorinputcidadao idcidadaoenviar">
    <h2>DIGITE A QUANTIDADE DO ITEM</h2>
    <input type="text" class="valorinputcidadao quantidadeitemenviar">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarEnviarItemParaCidadao('${item}')">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarEnviarItemParaCidadao(item) {
    const passaporte = $(".idcidadaoenviar").val();
    const quantidadeitem = $(".quantidadeitemenviar").val();

    $(".digitacaogerenciamento").fadeOut(700)

    $.post(`https://${GetParentResourceName()}/confirmarEnviarItemParaCidadao`, JSON.stringify({passaporte: passaporte, quantidade: quantidadeitem, item: item}), (data) => {
        const status = data.status

        if (status) {
            notificacaoLocal("Item enviado com sucesso!")
        } else {
            notificacaoLocal("Ocorreu um erro ao tentar enviar o item!")
        }
    })
}

function pegaritemStaff(item) {
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE A QUANTIDADE PARA PEGAR</h2>
    <input type="text" class="valorinputcidadao quantidadepegaritem">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarPegarItemStaff('${item}')">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarPegarItemStaff(item) {
    const quantidadeitem = $(".quantidadepegaritem").val();

    $(".digitacaogerenciamento").fadeOut(700)

    $.post(`https://${GetParentResourceName()}/confirmarPegarItemStaff`, JSON.stringify({quantidade: quantidadeitem, item: item}), (data) => {
        const status = data.status

        if (status) {
            notificacaoLocal("Item recebido com sucesso!")
        } else {
            notificacaoLocal("Ocorreu um erro ao tentar receber o item!")
        }
    })
}

function procurarInfoInventarioCidade() {
    const searchText = $(".inputinfoinventcidade").val().toLowerCase();
    $(".itemdiv").each(function() {
        const h2Text = $(this).find("h2").text().toLowerCase();
      
        if (
            h2Text.includes(searchText)
        ) {
            $(this.parentNode).show();
        } else {
            $(this.parentNode).hide();
        }
    });
}

function enviarveiculoCidadao(veiculo) {
    $(".digitacaogerenciamento").fadeOut(700)
    
    $(".digitacaogerenciamento").html(`
    <h2>DIGITE O ID DO CIDADÃO</h2>
    <input type="text" class="valorinputcidadao idcidadaoenviar">
    <div class="botoesdig">
        <button class="botaodiv_voltar" onclick="fecharDigitacao()">FECHAR</button>
        <button class="botaodiv_confirmar" onclick="confirmarEnviarVeiculoCidadao('${veiculo}')">CONFIRMAR</button>
    </div>
    `)

    $(".digitacaogerenciamento").fadeIn(700)
    $(".digitacaogerenciamento").css("display","flex")
}

function confirmarEnviarVeiculoCidadao(veiculo) {
    const passaporte = $(".idcidadaoenviar").val();

    $(".digitacaogerenciamento").fadeOut(700)

    $.post(`https://${GetParentResourceName()}/confirmarEnviarVeiculoCidadao`, JSON.stringify({passaporte: passaporte, veiculo: veiculo}), (data) => {
        const status = data.status

        if (status) {
            notificacaoLocal("Veiculo enviado com sucesso!")
        } else {
            notificacaoLocal("Ocorreu um erro ao tentar enviar o veiculo!")
        }
    })
}

function procurarInfoVeiculosCidade() {
    const searchText = $(".inputinfoveiculoscidade").val().toLowerCase();
    $(".itemdiv").each(function() {
        const h2Text = $(this).find("h2").text().toLowerCase();
      
        if (
            h2Text.includes(searchText)
        ) {
            $(this.parentNode).show();
        } else {
            $(this.parentNode).hide();
        }
    });
}

window.addEventListener("message", (event) => {
    const data = event.data

    if (data.mostrarnuiadm != undefined) {
        if (data.mostrarnuiadm) {
            const intervaloOpacidade = setInterval(function() {
                const opacity = $(".administracao").css("opacity");
                
                if (parseFloat(opacity) <= 1) {
                    clearInterval(intervaloOpacidade);
                    $('.administracao').stop().fadeIn(1000);
                    $('.administracao').css("display","flex");
                }
            }, 100);

            GerenciarMenu("GerenciarPlayers");
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (event.isComposing || event.key === "Escape") {
        $(".menumodal2").css("display","none")
        funcaofechar();
    }
});