
var _exudUserAdventureLang = {
	'en-uk': {
		'Options': 'Options',
		'Add' : 'Add',
		'Remove' : 'Remove',
		'Title' : 'Adventure Manager',
		'Filename' : 'Filename',
		'AddError' : 'Description is empty!',
		'AddItem' : 'Add Macro',
		'AutoFree': 'Always Free Units',
		'NoUnitsOnBoard' : 'Army disposed',
		'UnitReady' : 'Army ready',
		'Menuname' : 'Adventures',
		'Command' : 'Command',
		'CannotSet' : 'Something was wrong, cannot load army. Please verify in Specialists/Army (F9)',
		'Saved' : 'Saved !'
		},
	'pt-br' : {
		'Options': 'Opções',
		'Add' : 'Adicionar',
		'Remove' : 'Remover',
		'Title' : 'Gerenciar Aventuras',
		'Filename' : 'Arquivos Macro',
		'AddError' : 'A descrição está vazia!',
		'AddItem' : 'Adicionar Macro',
		'AutoFree': 'Libera sempre as unidades',
		'NoUnitsOnBoard' : 'Unidades liberadas',
		'UnitReady' : 'Generais configurados',
		'Menuname' : 'Aventuras',
		'Command' : 'Comando',
		'CannotSet' : 'Algo deu errado, Nao foi possivel carreagar as unidades. Verificar em Especialistas/Exercito (F9)',
		'Saved' : 'Salvado !'
		},
	'ru-ru': {
		'Options': 'Настройки',
		'Add' : 'Добавить',
		'Remove' : 'Удалить',
		'Title' : 'Менеджер приключений',
		'Filename' : 'Файл',
		'AddError' : 'Пустое описание!',
		'AddItem' : 'Добавить макро',
		'AutoFree': 'Всегда выгружать войска',
		'NoUnitsOnBoard' : 'Армия распущена',
		'UnitReady' : 'Армия готова',
		'Menuname' : 'Приключения',
		'Command' : 'Команда',
		'CannotSet' : 'Не все условия выполнены для загрузки армии. Проверьте в ручную в окне армии (F9)',
		'Saved' : 'Сохранено !'
		},
	'es-es' : {
		'Options': 'Macros',
		'Add' : 'Nueva aventura',
		'Remove' : 'Eliminar',
		'Title' : 'Ajustes de los Macros de Aventuras',
		'Filename' : 'Nombre del Macro',
		'AddError' : '¡Lo has dejado en blanco!',
		'AddItem' : 'Agregar Macro',
		'AutoFree': 'Descargar unidades siempre',
		'NoUnitsOnBoard' : 'Descargando unidades',
		'UnitReady' : 'Cargando unidades',
		'Menuname' : 'Aventuras',
		'Command' : 'Comando',
		'CannotSet' : "Algo salió mal, no fue posible cargar las unidades. Verifica en Especialistas -> Ejército / (F9)",
		'Saved' : 'Guardado !'
		},
	'fr-fr': {
		'Options': 'Options',
		'Add' : 'Ajouter',
		'Remove' : 'Enlever',
		'Title' : 'Aventure manager ',
		'Filename' : 'nom de fichier',
		'AddError' : 'la description est vide!',
		'AddItem' : 'Ajouter une macro',
		'AutoFree': 'Toujours les unités libres',
		'NoUnitsOnBoard' : 'Armées vidées',
		'UnitReady' : 'Armées prêtes',
		'Menuname' : 'Aventures',
		'Command' : 'Commande',
		'CannotSet' : "Il y a eu un problème, impossible de charger l'armée. Veuillez vérifier dans Spécialistes/Armée (F9)",
		'Saved' : 'Enregistré !'
  		},
	'pl-pl': {
		'Options': 'Opcje',
		'Add': 'Dodaj',
		'Remove': 'Usuń',
		'Title': 'Menedżer przygód',
		'Filename': 'Nazwa pliku',
		'AddError': 'Opis jest pusty!',
		'AddItem': 'Dodaj Makro',
		'AutoFree': 'Zawsze zwalniaj jednostki',
		'NoUnitsOnBoard': 'Armia rozładowana',
		'UnitReady': 'Armia gotowa',
		'Menuname': 'Przygody',
		'Command': 'Komenda',
		'CannotSet': 'Coś nie tak, nie udało się załadować armii. Sprawdź w Specjaliści/Armia (F9)',
		'Saved' : 'Zapisane !'
		},
	'de-de': {
		'Options': 'Optionen',
		'Add' : 'Hinzufügen',
		'Remove' : 'Entfernen',
		'Title' : 'Abenteuer Manager',
		'Filename' : 'Dateiname',
		'AddError' : 'Beschreibung ist leer!',
		'AddItem' : 'Makro hinzufügen',
		'AutoFree': 'Immer Truppen freilassen',
		'NoUnitsOnBoard' : 'Truppen entfernt',
		'UnitReady' : 'Truppen bereit',
		'Menuname' : 'Abenteuer',
		'Command' : 'Befehl',
		'CannotSet' : 'Irgendwas stimmt nicht, konnte Truppe nicht laden. Bitte überprüfe die Truppen unter Spezialisten/Armnee (F9)',
		'Saved' : 'Gerettet !'
		}
	};
	extendBaseLang(_exudUserAdventureLang, 'exudUserAdventureLang');

var _exudUserAdventureMainMenuName  = getText('Menuname', 'exudUserAdventureLang');
var _exudUserAdventureButtons = {
	"remove": utils.getImage(new(game.def("GUI.Assets::gAssetManager_ButtonIconThrowAway"))().bitmapData),
	"up": utils.getImage(new(game.def("GUI.Assets::gAssetManager_ArrowSmallNUp"))().bitmapData),
	"down": utils.getImage(new(game.def("GUI.Assets::gAssetManager_ArrowSmallSUp"))().bitmapData)
};
var _exudUserAdventurefileToOpen;
var _exudUserAdventureModalInitialized = false;
var _exudUserAdventureSettings = {
	'Adventures' : [],
	'AutoFree' : false
};

$.extend(_exudUserAdventureSettings, readSettings(null, 'usMKF_Adventures'));

// Creating Adventure Menu Item without function handler but with submenu
const toolsMenu = menu.nativeMenu.getItemByName("Tools");
const toolsItem = new air.NativeMenuItem(_exudUserAdventureMainMenuName);
toolsItem.name = _exudUserAdventureMainMenuName;
toolsItem.submenu = new air.NativeMenu();		
toolsMenu.submenu.addItem(toolsItem);
var _exudUserAdventuresSPECIALIST_TYPE = swmmo.getDefinitionByName("Enums::SPECIALIST_TYPE");


_exudUserAdventuresMakeMenu()

// regenerate adventures submenu and shortcuts
function _exudUserAdventuresMakeMenu()
{
	var m = [
		{ label: getText('Options', 'exudUserAdventureLang'), onSelect: _exudUserAdventureAddHandler },
		{ label: loca.GetText("LAB","UnloadUnits"), onSelect: _exudUserAdventureFreeAllUnits },
		{ type: 'separator' }
	];
	_exudAdventureGenMenuRecursive(_exudUserAdventureSettings.Adventures, m);
	toolsMenu.submenu.getItemByName(_exudUserAdventureMainMenuName).submenu = air.ui.Menu.createFromJSON(m);
}

function _exudAdventureGenMenuRecursive(item, m)
{
	item.forEach(function(adv){
		var s = { label: adv.Description, items: [] };
		adv.Items.forEach(function(i) {
			if(typeof i == 'object') {
				return _exudAdventureGenMenuRecursive([i], s.items);
			}
			s.items.push({ label: i.split("\\").pop().replace(/_/g, "[UNDERSCORE]"), name: i, onSelect: _exuduserAdventureMenuSelectedHandler });
		});
		m.push(s);
	});
}

// Execute a shortcut
function _exuduserAdventureMenuSelectedHandler(event)
{
	var Text = "";
	try {
		var file = new air.File();
		file.nativePath = event.target.name;
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.READ);
		Text = fileStream.readUTFBytes(file.size);
		fileStream.close();
		if (Text == "") { return; }
		if (_exudUserAdventureSettings.AutoFree)
			_exudUserAdventureFreeAllUnits();
		armyPacket = JSON.parse(Text);
		if(_exuduserAdventurearmyLoadData()) {
			armyLoadGenerals(true);
			game.showAlert(getText('UnitReady', 'exudUserAdventureLang'));
		}
	} catch (e) {
		alert(e);
	}
}

function _exuduserAdventurearmyLoadData()
{
	var exuduserAdventurearmyFreeInfo = {};
	try
	{
		if(Object.keys(armyPacket).length == 0) {
			return false;
		}
		var canSubmit = true;
		
		// Total army available
		game.zone.GetArmy(game.player.GetPlayerId()).GetSquadsCollection_vector().forEach(function(item){
			exuduserAdventurearmyFreeInfo[item.GetType()] = item.GetAmount();
		});
		
		$.each(armyPacket, function(item) { 
			var uniqueID = item.split(".")
			var uniqueIDPacket = game.def("Communication.VO::dUniqueID").Create(uniqueID[0], uniqueID[1]),
			var spec = game.zone.getSpecialist(game.player.GetPlayerId(), uniqueIDPacket);
			if(spec.GetGarrison() == null || spec.GetTask() != null || spec.GetGarrisonGridIdx() < 1 || spec.IsInUse() || spec.isTravellingAway()) {canSubmit = false; }
		});
		if (canSubmit)
		{
			var requiredArmy = {};
			$.each(armyPacket, function(item) {
				$.each(armyPacket[item], function(res) {
					if(res == "name") { return; }
					requiredArmy[res] = requiredArmy[res] + armyPacket[item][res] || armyPacket[item][res];
				});
			});
			$.each(requiredArmy, function(item) {
				if(exuduserAdventurearmyFreeInfo[item] < requiredArmy[item]) { canSubmit = false; }
			});
		}
	} catch (e)
	{
	}

	if (!canSubmit)
		game.showAlert(getText('CannotSet', 'exudUserAdventureLang'));	
	return canSubmit;
}

function _exudUserAdventureFreeAllUnits()
{
	var queue = new TimedQueue(1000);
	swmmo.application.mGameInterface.mCurrentPlayerZone.GetSpecialists_vector().forEach(function(item){
		try{
			if (game.player.GetPlayerId() == item.getPlayerID() && _exudUserAdventuresSPECIALIST_TYPE.IsGeneral(item.GetType()) && item.GetGarrisonGridIdx() > 0  && item.HasUnits() && !item.IsInUse() && !item.isTravellingAway())
			{
				queue.add(function(){ 
					armyMilitarySystem.SendRaiseArmyToServer(game.gi, item, null);
					//game.chatMessage(item.getName(false), getText('Menuname', 'exudUserAdventureLang'));
				});
			}
		}
		catch (e)
		{
		}
	});
	if(queue.len() > 0)
	{
		queue.run();
		game.showAlert(getText('NoUnitsOnBoard', 'exudUserAdventureLang'));
	}
	
}

// Option menu. Manage adventure shortcuts
function _exudUserAdventureAddHandler(event)
{
	$("div[role='dialog']:not(#UserAdventureModal):visible").modal("hide");
	
	if(!_exudUserAdventureModalInitialized)
		$('#UserAdventureModal').remove();
	
	try{
		if($('#UserAdventureModal .modal-header .container-fluid').length == 0){
			createModalWindow('UserAdventureModal', utils.getImageTag('$ExpeditionAdventure_.png', '45px') + ' ' + getText('Title', 'exudUserAdventureLang'));	
			
			select = $('<select>', { id: 'exudUserAdventureSelect', 'class': "form-control" });
			select.append($('<option>', { value:"---" }).text("---")).prop("outerHTML");
			checkbox = createSwitch("exudUserAdventureFreeChk", _exudUserAdventureSettings.AutoFree);

			$('#UserAdventureModal .modal-header').append(
				'<div class="container-fluid">' 
				+ createTableRow([[2, loca.GetText("LAB","AdventuresHelp")],[6, select.prop("outerHTML")],
				[4, '<div style="position: absolute;left: 55px;top: 1px;">&nbsp;&nbsp;'+getText('AutoFree', 'exudUserAdventureLang')+'</div>' + checkbox]], true)
				+ createTableRow([
						[10, getText('Filename', 'exudUserAdventureLang')],
						[2, getText('Command', 'exudUserAdventureLang')]
					], true)
				+ "</div>"
			);
			$('#UserAdventureModalData').html("<div id='exudUserAdventureRows'/>");
			$('#exudUserAdventureSelect').change(_exudUserAdventureUpdateView);
			
			$('#exudUserAdventureFreeChk').click(function() {
				_exudUserAdventureSettings.AutoFree = !_exudUserAdventureSettings.AutoFree;
			});
			

			$("#UserAdventureModal .modal-footer").prepend([
				$('<button>').attr({ "id": "exudUserAdventureSave", "class": "btn btn-primary exudUserAdventureSave" }).text(loca.GetText("LAB","GuildSave")),
				$('<button>').attr({ "id": "exudUserAdventureAdd","class": "btn btn-primary pull-left"}).text(getText('Add', 'exudUserAdventureLang')),
				$('<button>').attr({ "id": "exudUserAdventureRemove","class": "btn btn-primary pull-left"}).text(getText('Remove', 'exudUserAdventureLang')),
				$('<button>').attr({ "id": "exudUserAdventureAddItem","class": "btn btn-primary pull-left"}).text(getText('AddItem', 'exudUserAdventureLang'))
			]);
			$('#UserAdventureModal .modal-footer #exudUserAdventureRemove, #exudUserAdventureAddItem').hide();
			$('#exudUserAdventureAdd').click(function() {
				var des = prompt("Adventure name", '');
				if(des == null) { return; }
				if (des == "")
				{
					alert(getText('AddError', 'exudUserAdventureLang'));
					return;
				}
				var adv = _exudUserAdventureGetActAdv();
				var newUUID = _exudUseAdventureGenerateUUID();
				if(adv != null) {
					adv.Items.push({
						'UUID' : newUUID,
						'Description' : des,
						'Items' : new Array()
					});
				} else {
					_exudUserAdventureSettings.Adventures.push({
						'UUID' : newUUID,
						'Description' : des,
						'Items' : new Array()
					});
				}
				_exudUserAdventureRefresh();
				$("#exudUserAdventureSelect").val(newUUID).change();
			});
			$('#exudUserAdventureAddItem').click(function() {
				var adv = _exudUserAdventureGetActAdv();
				if (adv != null)
				{
					var base = readLastDir('army');
					_exudUserAdventurefileToOpen = air.File.documentsDirectory; 
					if (base != '')
						_exudUserAdventurefileToOpen.nativePath = base;
					_exudUserAdventureselectTextFile(_exudUserAdventurefileToOpen); 
				}
			});
			$('#exudUserAdventureRemove').click(function() {
				var AdvToDisplay = $('#exudUserAdventureSelect option:selected').val();
				for(var i = 0 ; i < _exudUserAdventureSettings.Adventures.length; i++) {
					if (_exudUserAdventureSettings.Adventures[i].UUID == AdvToDisplay) {
						_exudUserAdventureSettings.Adventures.splice(i, 1);
						break;
					}
					_exudUserAdventureRemoveRecursive(_exudUserAdventureSettings.Adventures[i].Items, AdvToDisplay);
				}
				_exudUserAdventureRefresh();
			});
			$('#UserAdventureModal .exudUserAdventureSave').click(function(){
				storeSettings(_exudUserAdventureSettings, 'usMKF_Adventures');
				_exudUserAdventuresMakeMenu();
				game.showAlert(getText('Saved', 'exudUserAdventureLang'));	
			});
			
			_exudUserAdventureModalInitialized = true;
		}

		_exudUserAdventureRefresh();
	}
	catch (e) {}
	
	$('#UserAdventureModal:not(:visible)').modal({ backdrop: "static" });
}

function _exudUserAdventureRemoveRecursive(t, idToRemove) {
	for (i in t) {
		if(typeof t[i] == 'object') {
			if(t[i].UUID == idToRemove) {
				t.splice(i, 1);
				continue;
			}
			_exudUserAdventureRemoveRecursive(t[i].Items, idToRemove);
		}
	}
}
// Browse files to add a macro to the list

function _exudUserAdventureselectTextFile(root) 
{ 
    var txtFilter = new air.FileFilter("Macro", "*.*"); 
    root.browseForOpen("Open", new window.runtime.Array(txtFilter)); 
    root.addEventListener(air.Event.SELECT, function(event) {
		var filename = _exudUserAdventurefileToOpen.nativePath;
		var adv = _exudUserAdventureGetActAdv();
		if (adv != null)
		{
			adv.Items.push(filename);
			_exudUserAdventureUpdateView();
		}
	}); 
}

// Udate rows
function _exudUserAdventureUpdateView()
{
	
	$( "#_exudAdventureDescription" ).val('');
	$('#exudUserAdventureRows').html("");
	var adv = _exudUserAdventureGetActAdv();
		
	if (adv != null)
	{
		$('#UserAdventureModal .modal-footer #exudUserAdventureRemove, #exudUserAdventureAddItem').show();
		$( "#_exudAdventureDescription" ).val(adv.Description);
		if (adv.Items != null && adv.Items.length > 0)
		{
			var out = "";
			adv.Items.forEach(function(i, idx) {
				if(typeof i == 'object') { return; }
				out += createTableRow([
					[10, i.split("\\").pop()],
					[2, "<a href='#' id='_exudUserAdventureRemoveA_"+idx+"'>"+_exudUserAdventureButtons["remove"]+"</a>" +
						(idx > 0 ? "&nbsp;<a href='#' id='_exudUserAdventureUpA_"+idx+"'>"+_exudUserAdventureButtons["up"]+"</a>" : "") +
						(idx != adv.Items.length - 1 ? "&nbsp;<a href='#' id='_exudUserAdventureDownA_"+idx+"'>"+_exudUserAdventureButtons["down"]+"</a>" : "")
					]
				], false);
			});
			$('#exudUserAdventureRows').html('<div class="container-fluid">{0}</div>'.format(out));
			
			$('#exudUserAdventureRows a[id^="_exudUserAdventureRemoveA_"]').click(function(e){
				var idx = parseInt(e.target.parentNode.id.replace("_exudUserAdventureRemoveA_",""));
				_exudUserAdventureGetActAdv().Items.splice(idx, 1);
				_exudUserAdventureUpdateView();
			});
			$('#exudUserAdventureRows a[id^="_exudUserAdventureUpA_"]').click(function(e){
				var idx = parseInt(e.target.parentNode.id.replace("_exudUserAdventureUpA_",""));
				_exudUserAdventureGetActAdv().Items[idx] = _exudUserAdventureGetActAdv().Items.splice(idx-1, 1, _exudUserAdventureGetActAdv().Items[idx])[0];
				_exudUserAdventureUpdateView();
			});
			$('#exudUserAdventureRows a[id^="_exudUserAdventureDownA_"]').click(function(e){
				var idx = parseInt(e.target.parentNode.id.replace("_exudUserAdventureDownA_",""));
				_exudUserAdventureGetActAdv().Items[idx] = _exudUserAdventureGetActAdv().Items.splice(idx+1, 1, _exudUserAdventureGetActAdv().Items[idx])[0];
				_exudUserAdventureUpdateView();
			});
		}
	} else {
		$('#UserAdventureModal .modal-footer #exudUserAdventureRemove, #exudUserAdventureAddItem').hide();
	}
	
}
function _exudUserAdventureGetActAdv()
{
	var AdvToDisplay = $('#exudUserAdventureSelect option:selected').val();
	var result = _exudUserAdventureGetActAdvRecursive(_exudUserAdventureSettings.Adventures, AdvToDisplay);
	return result;
}

function _exudUserAdventureGetActAdvRecursive(t, s)
{
	var result = null;
	for(n in t) {
		if (t[n].UUID == s) return t[n];
		t[n].Items.forEach(function(item){
			if(typeof item == 'object')
				result = _exudUserAdventureGetActAdvRecursive([item], s) || result;
		});
	};
	return result;
}


// Refresh comboBox and table
function _exudUserAdventureRefresh()
{
	$( "#_exudAdventureDescription" ).val('');
	$('#exudUserAdventureSelect').html("");
	$('#exudUserAdventureSelect').append($('<option>', { value:"---" }).text("---")).prop("outerHTML");
	_exudUserAdventureSettings.Adventures.sort(function(a, b) {
		return a.Description.toUpperCase().localeCompare(b.Description.toUpperCase());
	});
	_exudUserAdventureSettings.Adventures.forEach(function(adv){
		$('#exudUserAdventureSelect').append($('<option>', { value: adv.UUID }).text(adv.Description)).prop("outerHTML");
		var dim = [adv.Description];
		var depth = 0;
		for (i in adv.Items) {
			if(typeof adv.Items[i] == 'object') {
				depth = 1;
				_exudUserAdventureRefreshRecursive(adv.Items[i], dim, depth);
			}
		}
	});
	_exudUserAdventureUpdateView();
}

function _exudUserAdventureRefreshRecursive(t, dim, depth)
{
	dim = dim.slice(0, depth);
	dim.push(t.Description);
	$('#exudUserAdventureSelect').append($('<option>', { value: t.UUID }).text(dim.join(" -> "))).prop("outerHTML");
	for (i in t.Items) {
		if(typeof t.Items[i] == 'object') {
			depth++;
			_exudUserAdventureRefreshRecursive(t.Items[i], dim, depth);
		}
	}
}

// Generate an UUID
function _exudUseAdventureGenerateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
	return uuid;
}
