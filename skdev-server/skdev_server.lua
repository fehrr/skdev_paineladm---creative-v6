local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
local vRP = Proxy.getInterface("vRP")
local vCLIENT = Tunnel.getInterface("skdev_paineladm")
local vRPClient = Tunnel.getInterface("vRP")

local itemlistGlobal = ItemListGlobal()
local vehicleGlobal = VehicleGlobal()

skdev = {}
Tunnel.bindInterface("skdev_paineladm",skdev)

CreateThread(function()
    Preparebase("skdev/informacao2", [[CREATE TABLE IF NOT EXISTS skdev_punicoes_paineladm(
        user_id int(50) NOT NULL,
        staff_id int(50) NOT NULL,
        advertencia varchar(100) NOT NULL DEFAULT "",
        motivo varchar(100) NOT NULL DEFAULT "",
        data varchar(100) NOT NULL DEFAULT ""
    )]])
    Querybase("skdev/informacao2",nil,"execute")

    Preparebase("skdev/todosCidadoes","SELECT * FROM "..config.userdata_table.."")
    Preparebase("skdev/selectVehicleCidadao","SELECT * FROM "..config.vehicledata_table.." WHERE Passport = @user_id")
    Preparebase("skdev/selectVehicleCidadaoDeep","SELECT * FROM "..config.vehicledata_table.." WHERE Passport = @user_id AND vehicle = @vehicle")
    Preparebase("skdev/deleteVehicleCidadao","DELETE FROM "..config.vehicledata_table.." WHERE Passport = @user_id AND vehicle = @vehicle")
    Preparebase("skdev/insertVehicleCidadao","INSERT IGNORE INTO "..config.vehicledata_table.."(Passport,vehicle,plate,work,tax) VALUES (@user_id,@vehicle,@placa,@work,UNIX_TIMESTAMP() + 604800)")

    Preparebase("skdev/updtidentity","UPDATE "..config.identitydata_table.." SET name = @firstname, name2 = @name, serial = @registration, phone = @phone WHERE id = @user_id")

    Preparebase("skdev/punis_selectall","SELECT * FROM skdev_punicoes_paineladm")
    Preparebase("skdev/punis_selectplayer","SELECT * FROM skdev_punicoes_paineladm WHERE user_id = @user_id")
    Preparebase("skdev/punis_selectplayerdeep","SELECT * FROM skdev_punicoes_paineladm WHERE user_id = @user_id AND advertencia = @punicao")
    Preparebase("skdev/punis_insertplayer","INSERT INTO skdev_punicoes_paineladm(user_id,staff_id,advertencia,motivo,data) VALUES (@user_id,@staff_id,@advertencia,@motivo,@data)")
    Preparebase("skdev/punis_removeplayer","DELETE FROM skdev_punicoes_paineladm WHERE user_id = @user_id AND advertencia = @punicao")
end)

function skdev.permissaoadmin()
    local source = source
    local user_id = Passportbase(source)

    for k,v in pairs(config.cargos) do
        local index = nil
        if v.index_permissao then
            index = parseInt(v.index_permissao)
        end
        if HasPermissionbase(user_id,v.permissao_ingame,index) then
            return true
        end
    end

    return false
end

function verificarPermissaoAjudante(user_id,permissao)
    local user_id = parseInt(user_id)

    for k,v in pairs(config.cargos) do
        local index = nil
        if v.index_permissao then
            index = parseInt(v.index_permissao)
        end
        if HasPermissionbase(user_id, v.permissao_ingame,index) then
            for b,c in pairs(v.permissoes_painel) do
                if c ~= nil then
                    if c == permissao then
                        return true
                    end
                end
            end
        end
    end

    return false
end

function dataFormatada(timestamp)
    local timestamp = os.date("*t", timestamp)
    local dia = timestamp.day
    local mes = timestamp.month
    local ano = timestamp.year
    local hora = timestamp.hour
    local minuto = timestamp.min

    return string.format("%02d/%02d/%04d %02d:%02d", dia, mes, ano, hora, minuto)
end

function skdev.menuinicial()
    local source = source
    local user_id = Passportbase(source)

    local nome = "Indigente"
    local cargo = "Ajudante"

    local identity = Identitybase(user_id)
    if identity ~= nil then
        nome = identity.name.." "..identity.name2
    end

    for k,v in pairs(config.cargos) do
        if cargo == "Ajudante" then
            local index = nil
            if v.index_permissao then
                index = parseInt(v.index_permissao)
            end
            if HasPermissionbase(user_id, v.permissao_ingame,index) then
                cargo = v.nome_no_painel
            end
        end
    end

    return nome, cargo
end

function skdev.cidadoesinformacoes()
    local source = source
    local user_id = Passportbase(source)

    local tabelaIDS = {}
    local tabela = {}

    local queryCidadoes = Querybase("skdev/todosCidadoes",nil,"query")
    for k,v in pairs(queryCidadoes) do
        if tabelaIDS[parseInt(v.Passport)] == nil then
            tabelaIDS[parseInt(v.Passport)] = true
        end
    end

    for k,v in pairs(tabelaIDS) do
        if Getusersourcebase(parseInt(k)) then
            local identity = Identitybase(parseInt(k))
            if identity ~= nil then
                tabela[#tabela+1] = {passaporte = parseInt(k), nome = identity.name.." "..identity.name2, nomestatus = "presencaonline", status = "ONLINE"}
            else
                tabela[#tabela+1] = {passaporte = parseInt(k), nome = "Indigente", nomestatus = "presencaonline", status = "ONLINE"}
            end
        else
            local identity = Identitybase(parseInt(k))
            if identity ~= nil then
                tabela[#tabela+1] = {passaporte = parseInt(k), nome = identity.name.." "..identity.name2, nomestatus = "presencaoffline", status = "OFFLINE"}
            else
                tabela[#tabela+1] = {passaporte = parseInt(k), nome = "Indigente", nomestatus = "presencaoffline", status = "OFFLINE"}
            end
        end
    end

    return tabela
end

function skdev.informacaoGaragem(passaporte)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)

    local tabela = {}

    if verificarPermissaoAjudante(user_id,"remover veiculos") then
        local queryVEHS = Querybase("skdev/selectVehicleCidadao",{user_id = passaporte},"query")
        if #queryVEHS > 0 then
            for k,v in pairs(queryVEHS) do
                if Vehiclenamebase(v.vehicle) ~= nil then
                    tabela[#tabela+1] = {veiculopainel = Vehiclenamebase(v.vehicle), veiculo = v.vehicle}
                else
                    tabela[#tabela+1] = {veiculopainel = v.vehicle, veiculo = v.vehicle}
                end
            end
        end
    end

    return tabela
end

function skdev.removerVeiculoPlayer(passaporte,veiculo)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)
    
    local status = false

    if verificarPermissaoAjudante(user_id,"remover veiculos") then
        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - REMOVER VEICULO]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE DO VEICULO REMOVIDO]: "..passaporte.."\n[NOME DO VEICULO]: "..veiculo.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        Querybase("skdev/deleteVehicleCidadao",{user_id = passaporte, vehicle = veiculo},"execute")
        status = true
    end
    
    return status
end

function skdev.informacaoInventario(passaporte)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)

    local tabela = {}

    if verificarPermissaoAjudante(user_id,"remover itens") then
        local inventario = Getinventorybase(passaporte)
        for k,v in pairs(inventario) do
            if Itemnamelistbase(v.item) ~= nil then
                tabela[#tabela+1] = {nomedoitem = Itemnamelistbase(v.item), quantidadedoitem = parseInt(v.amount), item = v.item, slot = parseInt(k)}
            else
                tabela[#tabela+1] = {nomedoitem = v.item, quantidadedoitem = parseInt(v.amount), item = v.item, slot = parseInt(k)}
            end
        end
    end

    return tabela
end

function skdev.removerItemPlayer(passaporte,item,slot,amount)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)
    local slot = parseInt(slot)
    local amount = parseInt(amount)
    
    local status = false
    
    if verificarPermissaoAjudante(user_id,"remover itens") then
        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - REMOVER ITEM]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE DO ITEM REMOVIDO]: "..passaporte.."\n[NOME DO ITEM]: "..item.."\n[QUANTIDADE]: "..amount.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        if Trygetinventorybase(passaporte,item,amount) then
            status = true
        end
    end
    
    return status
end

function skdev.informacaoCidadao(passaporte)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local tabela = {}

    local nome = "Indigente"
    local telefone = "333-333"
    local registro = "SKDEV"
    local carteira = Getmoneybase(passaporte)
    local banco = Getbankmoneybase(passaporte)

    local identity = Identitybase(passaporte)
    if identity ~= nil then
        nome = identity.name.." "..identity.name2
        telefone = identity.phone
        registro = identity.registration
    end

    tabela = {["nome"] = nome, ["telefone"] = telefone, ["registro"] = registro, ["carteira"] = carteira, ["banco"] = banco}

    return tabela
end

function skdev.confirmarCidadao(passaporte,tipo,valor)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local status = false

    if tipo == "TELEFONE" then
        if verificarPermissaoAjudante(user_id,"alterar telefone") then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ALTERAR TELEFONE]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ALTERADO]: "..passaporte.."\n[TELEFONE]: "..valor.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            local identity = Identitybase(passaporte)
            if identity ~= nil then
                Updateidentitybase({firstname = identity.name2, name = identity.name, age = identity.age, registration = identity.registration, phone = valor, user_id = passaporte})
                status = true
            end
        end
    end
    if tipo == "REGISTRO" then
        if verificarPermissaoAjudante(user_id,"alterar registro") then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ALTERAR REGISTRO]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ALTERADO]: "..passaporte.."\n[REGISTRO]: "..valor.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            local identity = Identitybase(passaporte)
            if identity ~= nil then
                Updateidentitybase({firstname = identity.name2, name = identity.name, age = identity.age, registration = valor, phone = identity.phone, user_id = passaporte})
                status = true
            end
        end
    end
    if tipo == "CARTEIRA" then
        if verificarPermissaoAjudante(user_id,"alterar carteira") then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ALTERAR CARTEIRA]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ALTERADO]: "..passaporte.."\n[VALOR CARTEIRA]: "..valor.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            Setmoneybase(passaporte,parseInt(valor))
            status = true
        end
    end
    if tipo == "BANCO" then
        if verificarPermissaoAjudante(user_id,"alterar banco") then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ALTERAR BANCO]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ALTERADO]: "..passaporte.."\n[VALOR BANCO]: "..valor.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            Setbankmoneybase(passaporte,parseInt(valor))
            status = true
        end
    end

    return status
end

function skdev.alterarNome(passaporte,nome,sobrenome)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"alterar nome") then
        local identity = Identitybase(passaporte)
        if identity ~= nil then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ALTERAR NOME]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ALTERADO]: "..passaporte.."\n[NOVO NOME]: "..nome.." "..sobrenome.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            Updateidentitybase({firstname = sobrenome, name = nome, age = identity.age, registration = identity.registration, phone = identity.phone, user_id = passaporte})
            status = true
        end
    end

    return status
end

function skdev.confirmarKick(passaporte,motivo)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"expulsar cidadoes") then
        if Getusersourcebase(passaporte) then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - KICKAR]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE KICKADO]: "..passaporte.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            local sourceP = Getusersourcebase(passaporte)

            Kickbase(sourceP,"VOCÊ FOI EXPULSO DA CIDADE PELO STAFF: "..user_id..", MOTIVO: "..motivo.."")
            status = true
        end
    end

    return status
end

function skdev.confirmarBan(passaporte,motivo)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"banir cidadoes") then
        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - BANIR]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE BANIDO]: "..passaporte.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        Setbanbase(passaporte,true)

        if Getusersourcebase(passaporte) then
            local sourceP = Getusersourcebase(passaporte)
            Kickbase(sourceP,"VOCÊ FOI BANIDO DA CIDADE PELO STAFF: "..user_id..", MOTIVO: "..motivo.."")
        end

        status = true
    end

    return status
end

function skdev.confirmarADV(passaporte,motivo)
    local source = source
    local user_id = Passportbase(source)
    
    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"adverter cidadoes") then
        local selecionaradv = Querybase("skdev/punis_selectplayer",{user_id = passaporte},"query")
        if #selecionaradv > 0 then
            if #selecionaradv == 1 then
                Querybase("skdev/punis_insertplayer",{user_id = passaporte, staff_id = user_id, advertencia = 2, motivo = motivo, data = os.time()},"execute")
            end
            if #selecionaradv == 2 then
                Querybase("skdev/punis_insertplayer",{user_id = passaporte, staff_id = user_id, advertencia = 3, motivo = motivo, data = os.time()},"execute")
                Querybase("skdev/punis_insertplayer",{user_id = passaporte, staff_id = user_id, advertencia = "BANIDO", motivo = motivo, data = os.time()},"execute")
                Setbanbase(passaporte,true)
                if Getusersourcebase(passaporte) then
                    local sourceP = Getusersourcebase(passaporte)
                    Kickbase(sourceP,"VOCÊ FOI BANIDO DA CIDADE PELO STAFF: "..user_id..", MOTIVO: "..motivo.."")
                end
            end
        else
            Querybase("skdev/punis_insertplayer",{user_id = passaporte, staff_id = user_id, advertencia = 1, motivo = motivo, data = os.time()},"execute")
        end

        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - ADVERTÊNCIA]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ADVERTIDO]: "..passaporte.."\n[MOTIVO]: "..motivo.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        status = true
    end

    return status
end

function skdev.cidadoesPunicoesInformacoes()
    local source = source
    local user_id = Passportbase(source)

    local tabela = {}

    local allPunicoes = Querybase("skdev/punis_selectall",nil,"query")
    for k,v in pairs(allPunicoes) do
        local identity = Identitybase(parseInt(v.user_id))
        if identity ~= nil then
            tabela[#tabela+1] = {passaporte = v.user_id, nome = identity.name.." "..identity.name2, punicao = v.advertencia}
        else
            tabela[#tabela+1] = {passaporte = v.user_id, nome = "Indigente", punicao = v.advertencia}
        end
    end

    return tabela
end

function skdev.receberInformacaoPuni(passaporte,motivo)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)

    local tabela = {}

    if verificarPermissaoAjudante(user_id,"remover advertencias") then
        local punicao = Querybase("skdev/punis_selectplayerdeep",{user_id = passaporte, punicao = tostring(motivo)},"query")

        if #punicao > 0 then
            local identity = Identitybase(parseInt(punicao[1].staff_id))
            if identity ~= nil then
                tabela = {passaporte = parseInt(punicao[1].staff_id), nomedostaff = identity.name.." "..identity.name2, data = dataFormatada(parseInt(punicao[1].data)), motivo = punicao[1].motivo}
            else
                tabela = {passaporte = parseInt(punicao[1].staff_id), nomedostaff = "Indigente", data = dataFormatada(parseInt(punicao[1].data)), motivo = punicao[1].motivo}
            end
        end
    end

    return tabela
end

function skdev.removerPuni(passaporte,motivo)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"remover advertencias") then
        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - REMOVER ADVERTÊNCIA]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE REMOVIDO]: "..passaporte.."\n[MOTIVO]: "..motivo.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        Querybase("skdev/punis_removeplayer",{user_id = passaporte, punicao = tostring(motivo)},"execute")

        local query = Querybase("skdev/punis_selectplayerdeep",{user_id = passaporte, punicao = tostring(motivo)},"query")
        if #query <= 0 then
            status = true
        end
    end

    return status
end

function skdev.inventariodacidadeinformacoes()
    local source = source
    local user_id = Passportbase(source)

    local tabela = {}

    for k,v in pairs(itemlistGlobal) do
        if v["Name"] ~= nil then
            tabela[#tabela+1] = {itempainel = v["Name"], item = k, index = v["Index"]}
        end
    end

    return tabela
end

function skdev.confirmarEnviarItemParaCidadao(passaporte,item,amount)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)
    local amount = parseInt(amount)

    local status = false

    if verificarPermissaoAjudante(user_id,"enviar itens") then
        if Getusersourcebase(passaporte) then
            if Getinventoryweightbase(passaporte) < Getinventorymaxweightbase(passaporte) and ((Getitemweightbase(item) * amount) + Getinventoryweightbase(passaporte)) < Getinventorymaxweightbase(passaporte) then
                local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
                local webhook = "[PAINEL ADM - ENVIAR ITEM]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ENVIADO]: "..passaporte.."\n[ITEM]: "..item.."\n[QUANTIA]: "..amount.."\n[DATA]: "..dataAtual..""
                Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

                Giveinventoryitembase(passaporte,item,parseInt(amount))
                status = true
            end
        end
    end

    return status
end

function skdev.confirmarPegarItemStaff(item,amount)
    local source = source
    local user_id = Passportbase(source)
    
    local amount = parseInt(amount)
    
    local status = false
    
    if verificarPermissaoAjudante(user_id,"enviar itens") then
        local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
        local webhook = "[PAINEL ADM - PEGAR ITEM]\n[ID AJUDANTE]: "..user_id.."\n[ITEM]: "..item.."\n[QUANTIA]: "..amount.."\n[DATA]: "..dataAtual..""
        Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

        Giveinventoryitembase(user_id,item,amount)
        status = true
    end
    
    return status
end

function skdev.veiculosdacidadeinformacoes()
    local source = source
    local user_id = Passportbase(source)

    local tabela = {}

    for k,v in pairs(vehicleGlobal) do
        if v["Name"] ~= nil then
            tabela[#tabela+1] = {veiculopainel = v["Name"], veiculo = k}
        end
    end

    return tabela
end

function skdev.confirmarEnviarVeiculoCidadao(passaporte,veiculo)
    local source = source
    local user_id = Passportbase(source)

    local passaporte = parseInt(passaporte)

    local status = false

    if verificarPermissaoAjudante(user_id,"enviar veiculos") then
        local queryVeh = Querybase("skdev/selectVehicleCidadaoDeep",{user_id = passaporte, vehicle = veiculo},"query")
        if #queryVeh <= 0 then
            local dataAtual = os.date("%H") .. ":" .. os.date("%M") .. " " .. os.date("%d") .. "/" .. os.date("%m") .. "/" .. os.date("%Y")
            local webhook = "[PAINEL ADM - ENVIAR VEICULO]\n[ID AJUDANTE]: "..user_id.."\n[PASSAPORTE ENVIADO]: "..passaporte.."\n[VEICULO]: "..veiculo.."\n[DATA]: "..dataAtual..""
            Sendwebhookbase(config.webhook_paineladm,"```ini\n"..webhook.."```")

            vRP.GeneratePlate()
            Querybase("skdev/insertVehicleCidadao",{user_id = passaporte, vehicle = veiculo, placa = vRP.GeneratePlate(), work = tostring(false)},"execute")

            status = true
        end
    end

    return status
end