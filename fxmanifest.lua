fx_version 'cerulean'
game 'gta5'

name 'Everfall Shops'
author 'Jellyton'
version '1.0.0'
description 'Everfall shops system. Made with React.'
license 'GPL-3.0'
repository 'https://github.com/jellyton69/ef-shops'

lua54 'yes'

ui_page 'web/build/index.html'

shared_scripts {
	'@ox_lib/init.lua',
	'@qbx_core/modules/lib.lua',
	'shared/**/*.lua'
}

client_scripts {
	'@qbx_core/modules/playerdata.lua',
	'client/**/*.lua'
}

server_scripts {
	'@qbx_core/modules/hooks.lua',
	'@oxmysql/lib/MySQL.lua',
	'server/**/*.lua'
}

files {
	'config.lua',
	'web/build/index.html',
	'web/build/**/*',
}

depedencies {
	'ox_lib',
	'qbx_core',
}
