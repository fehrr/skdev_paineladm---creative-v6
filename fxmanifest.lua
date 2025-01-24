fx_version "bodacious"
game "gta5"

shared_script "@vrp/lib/lib.lua"

client_scripts {
    "@vrp/lib/utils.lua",
    "skdev-config/*",
    "skdev-client/*"
}

server_scripts {
    "@vrp/lib/utils.lua",
    "@vrp/config/Vehicle.lua",
    "@vrp/config/Item.lua",
    "skdev-config/*",
    "skdev-server/*"
}

ui_page "skdev-nui/index.html"

files {
    "skdev-nui/*.html",
    "skdev-nui/**/**/*.css",
    "skdev-nui/**/**/*.js",
    "skdev-nui/**/**/*.png",
    "skdev-nui/**/**/*.svg",
    "skdev-nui/**/**/*",
}