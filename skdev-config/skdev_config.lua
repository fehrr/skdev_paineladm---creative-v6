config = {}

config.imagensveiculos = "nui://vrp/config/inventory" -- sem o / no final
config.imagensinventario = "nui://vrp/config/inventory" -- sem o / no final

config.userdata_table = "playerdata" -- user data da sua database
config.vehicledata_table = "vehicles" -- tabela de veiculos da sua database
config.identitydata_table = "characters" -- tabela de identidades da sua database

baseatual = "creativev6" -- vrpex, creativev1, creativev2, creativev3, creativev4, creativev5, creativev6

config.webhook_images = ""
config.webhook_paineladm = ""

config.cargos = { -- remover veiculos, remover itens, alterar nome, alterar telefone, alterar registro, alterar carteira, alterar banco, expulsar cidadoes, banir cidadoes, adverter cidadoes, remover advertencias, enviar itens, enviar casas
    {
        nome_no_painel = "Admininstrador",
        permissao_ingame = "Admin",
        index_permissao = 1,

        permissoes_painel = {"remover veiculos","remover itens","alterar nome","alterar telefone","alterar registro","alterar carteira","alterar banco","expulsar cidadoes","banir cidadoes","adverter cidadoes","remover advertencias","enviar itens","enviar veiculos","enviar casas"},
    },
    {
        nome_no_painel = "Moderador",
        permissao_ingame = "Admin",
        index_permissao = 3,

        permissoes_painel = {"expulsar cidadoes","banir cidadoes","adverter cidadoes"},
    },
    {
        nome_no_painel = "Suporte",
        index_permissao = 4,

        permissoes_painel = {"expulsar cidadoes","banir cidadoes","adverter cidadoes"},
    }
}