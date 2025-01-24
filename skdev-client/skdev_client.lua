local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
local vRP = Proxy.getInterface("vRP")
local vSERVER = Tunnel.getInterface("skdev_paineladm")

skdev = {}
Tunnel.bindInterface("skdev_paineladm",skdev)

RegisterCommand("paineladm", function(source,args,rawcmd)
    if vSERVER.permissaoadmin() then
        SendNUIMessage({mostrarnuiadm = true})
        SetNuiFocus(true, true)
    end
end)

RegisterNUICallback("close", function(data,cb)
    SetNuiFocus(false, false)
end)

RegisterNUICallback("cidadoesinformacoes", function(data,cb)
    local tabela = vSERVER.cidadoesinformacoes()
    local nome, cargo = vSERVER.menuinicial()

    cb({tabela = tabela, nome = nome, cargo = cargo})
end)

RegisterNUICallback("informacaoGaragem", function(data,cb)
    local passaporte = data.passaporte
    local tabela = vSERVER.informacaoGaragem(passaporte)

    cb({tabela = tabela, imagen = config.imagensveiculos})
end)

RegisterNUICallback("removerVeiculoPlayer", function(data,cb)
    local passaporte = data.passaporte
    local veiculo = data.veiculo
    local status = vSERVER.removerVeiculoPlayer(passaporte,veiculo)

    cb({status = status})
end)

RegisterNUICallback("informacaoInventario", function(data,cb)
    local passaporte = data.passaporte
    local tabela = vSERVER.informacaoInventario(passaporte)

    cb({tabela = tabela, imagen = config.imagensinventario})
end)

RegisterNUICallback("removerItemPlayer", function(data,cb)
    local passaporte = data.passaporte
    local item = data.item
    local slot = data.slot
    local amount = data.amount

    local status = vSERVER.removerItemPlayer(passaporte,item,slot,amount)

    cb({status = status})
end)

RegisterNUICallback("informacaoCidadao", function(data,cb)
    local passaporte = data.passaporte
    local tabela = vSERVER.informacaoCidadao(passaporte)

    cb({tabela = tabela})
end)

RegisterNUICallback("confirmarCidadao", function(data,cb)
    local passaporte = data.passaporte
    local tipo = data.tipo
    local valor = data.valor
    local status = vSERVER.confirmarCidadao(passaporte,tipo,valor)

    cb({status = status})
end)

RegisterNUICallback("alterarNome", function(data,cb)
    local passaporte = data.passaporte
    local nome = data.nome
    local sobrenome = data.sobrenome
    local status = vSERVER.alterarNome(passaporte,nome,sobrenome)

    cb({status = status})
end)

RegisterNUICallback("confirmarKick", function(data,cb)
    local passaporte = data.passaporte
    local motivo = data.motivo
    local status = vSERVER.confirmarKick(passaporte,motivo)

    cb({status = status})
end)

RegisterNUICallback("confirmarBan", function(data,cb)
    local passaporte = data.passaporte
    local motivo = data.motivo
    local status = vSERVER.confirmarBan(passaporte,motivo)

    cb({status = status})
end)

RegisterNUICallback("confirmarADV", function(data,cb)
    local passaporte = data.passaporte
    local motivo = data.motivo
    local status = vSERVER.confirmarADV(passaporte,motivo)

    cb({status = status})
end)

RegisterNUICallback("cidadoespunicoesinformacoes", function(data,cb)
    local tabela = vSERVER.cidadoesPunicoesInformacoes()

    cb({tabela = tabela})
end)

RegisterNUICallback("receberInformacaoPuni", function(data,cb)
    local passaporte = data.passaporte
    local punicao = data.punicao
    local tabela = vSERVER.receberInformacaoPuni(passaporte,punicao)

    cb({tabela = tabela})
end)

RegisterNUICallback("removerPuni", function(data,cb)
    local passaporte = data.passaporte
    local punicao = data.punicao
    local status = vSERVER.removerPuni(passaporte,punicao)

    cb({status = status})
end)

RegisterNUICallback("inventariodacidadeinformacoes", function(data,cb)
    local tabela = vSERVER.inventariodacidadeinformacoes()

    cb({tabela = tabela, imagen = config.imagensveiculos})
end)

RegisterNUICallback("confirmarEnviarItemParaCidadao", function(data,cb)
    local passaporte = data.passaporte
    local item = data.item
    local quantidade = data.quantidade
    local status = vSERVER.confirmarEnviarItemParaCidadao(passaporte,item,quantidade)

    cb({status = status})
end)

RegisterNUICallback("confirmarPegarItemStaff", function(data,cb)
    local item = data.item
    local quantidade = data.quantidade
    local status = vSERVER.confirmarPegarItemStaff(item,quantidade)

    cb({status = status})
end)

RegisterNUICallback("veiculosdacidadeinformacoes", function(data,cb)
    local tabela = vSERVER.veiculosdacidadeinformacoes()

    cb({tabela = tabela, imagen = config.imagensveiculos})
end)

RegisterNUICallback("confirmarEnviarVeiculoCidadao", function(data,cb)
    local passaporte = data.passaporte
    local veiculo = data.veiculo
    local status = vSERVER.confirmarEnviarVeiculoCidadao(passaporte,veiculo)

    cb({status = status})
end)