
var shortcutsTypes = { '[b]': 'a ', '[a]': 'l ', '[m]': 'm ', '[g]': 'g ', '[e]': 'e ', '[u]': 'b ', '[p]': 'p ' };
var shortcutsWindow;
var shortcutsLRUItem;
var shortcutsImportedTree;
var shortcutsImportedGens;
var shortcutsTypesLang = {
	'a ': loca.GetText("ACL", "PvPAttacker"),
	'l ': loca.GetText("LAB","Army"),
	'm ': loca.GetText("LAB", "Move"),
	'g ': loca.GetText("SPE", "Geologist"),
	'e ': loca.GetText("SPE", "Explorer"),
	'b ': loca.GetText("LAB", "Buffs"),
	'p ': loca.GetText("LAB", "Production"),
};

var shortcutsSettings = [];
$.extend(shortcutsSettings, readSettings(null, 'shortcuts'));

function shortcutsMakeMenu()
{
	var m = [
		{ label: loca.GetText("LAB","ToggleOptionsPanel"), mnemonicIndex: 0, onSelect: shortcutsAddHandler },
		{ label: loca.GetText("LAB","UnloadUnits"), mnemonicIndex: 0, onSelect: shortcutsFreeAllUnits },
		{ label: getText('shortcutsToStar'), mnemonicIndex: 0, onSelect: shortcutsReturnAll },
		{ label: loca.GetText("LAB", "WarehouseTab7"), mnemonicIndex: 0, onSelect: shortcutsPickupAll },
		{ type: 'separator' }
	];
	shortcutsGenMenuRecursive(shortcutsSettings, m);
	menu.nativeMenu.getItemByName("Shortcuts").submenu = air.ui.Menu.createFromJSON(m);
}

function shortcutsGenMenuRecursive(item, m)
{
	item.forEach(function(data, idx){
		if(/--s[0-9]+p--/.test(data)) {
			m.push({ type: 'separator' });
			return;
		}
		if(Array.isArray(data)) {
			var label = "{0}. [{1}] {2}".format(
				idx,
				shortcutsTypesLang[shortcutsStripType(data[0])[1]], data[1] == null ? shortcutsStripType(data[0])[0].split("\\").pop().replace(/_/g, "[UNDERSCORE]") : data[1].replace(/_/g, "[UNDERSCORE]")
			);
			m.push({ label: label, mnemonicIndex: 0, name: data[0], onSelect: shortcutsMenuSelectedHandler });
			return;
		}
		var s = { label: data.name.replace(/_/g, "[UNDERSCORE]"), mnemonicIndex: 0, items: [] };
		data.items.forEach(function(i, index) {
			if(typeof i == 'object' && !Array.isArray(i)) {
				return shortcutsGenMenuRecursive([i], s.items);
			}
			if(/--s[0-9]+p--/.test(i)) {
				s.items.push({ type: 'separator' });
			} else {
				var label = "{0}. [{1}] {2}".format(
					index,
					shortcutsTypesLang[shortcutsStripType(i[0])[1]], i[1] == null ? shortcutsStripType(i[0])[0].split("\\").pop().replace(/_/g, "[UNDERSCORE]") : i[1].replace(/_/g, "[UNDERSCORE]")
				);
				s.items.push({ label: label, mnemonicIndex: 0, name: i[0], onSelect: shortcutsMenuSelectedHandler });
			}
		});
		m.push(s);
	});
}

function shortcutsStripType(value)
{
	var possibleType = value.slice(-3);
	if(shortcutsTypes[possibleType] == null)
		return [value, '^ '];
	return [value.slice(0, -3), shortcutsTypes[possibleType]]; 
}

function shortcutsMenuSelectedHandler(event)
{
	if(shortcutsLRUItem) {
		shortcutsLRUItem.label = shortcutsLRUItem.label.slice(2);
	}
	shortcutsLRUItem = event.target;
	shortcutsLRUItem.label = "->{0}".format(shortcutsLRUItem.label);
	try {
		var filetype = shortcutsStripType(event.target.name);
		var file = new air.File(filetype[0]);
		if(!file.exists) {
			alert(getText("bad_template"));
			return;
		}
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.READ);
		var data = fileStream.readUTFBytes(file.size);
		fileStream.close();
		if (data == "") { return; }
		shortcutsProceedFile(JSON.parse(data), filetype[1]);
	} catch(e) {
		alert(getText("bad_template"));
	}
}

function shortcutsProceedFile(data, type)
{
	switch(type) {
		case 'l ':
			armyMenuHandler(null);
			armyPacket = armyConvertTemplate(data);
			armyLoadData();
		break;
		case 'm ':
		case 'a ':
			battleMenuHandler(null);
			if(game.gi.isOnHomzone()) { return; }
			battlePacket = data;
			battleLoadData();
		break;
		case 'e ':
		case 'g ':
			specSharedHandler(type == 'e ' ? 1 : 2);
			$('#specModalData select').val(0);
			$.each(data, function(spec, val) { $('#' + spec.replace('expl-','')).val(val); });
			$('#specModalData select').each(function(i, select){
				updateSpecTimeRow(select, $(select).val(), $(select).val());
			});
		break;
		case 'b ':
			buffRecord = data;
			buffSourceRecord = false;
			menuBuffsHandler(null);
		break;
		case 'p ':
			buildingRecord = data;
			menuBuildingHandler(null);
		break;
	}
}

function shortcutsReturnAll()
{
	var queue = new TimedQueue(1000);
	swmmo.application.mGameInterface.mCurrentPlayerZone.GetSpecialists_vector().forEach(function(item){
		if (game.player.GetPlayerId() == item.getPlayerID() && 
		    armySPECIALIST_TYPE.IsGeneral(item.GetType()) && 
			item.GetGarrisonGridIdx() > 0  && !item.IsInUse() && !item.isTravellingAway())
		{
			queue.add(function(){ armySendGeneralToStar(item); });
		}
	});
	if(queue.len() > 0)
	{
		queue.add(function(){ game.showAlert(loca.GetText("LAB", "GuildQuestCompleted")); });
		queue.run();
		game.showAlert(getText('command_sent'));
	}
}

function shortcutsPickupAll(event) {
    var collectionsManager = swmmo.getDefinitionByName("Collections::CollectionsManager").getInstance(),
        queue = new TimedQueue(1000),
        questTriggersMap = {},
        itemBuildingName, itemGOContainer;
    if (game.gi.mCurrentPlayer.mIsAdventureZone && game.gi.mNewQuestManager.GetQuestPool().IsAnyQuestsActive()) {
		$.each(game.gi.mNewQuestManager.GetQuestPool().GetQuest_vector(), function(i, item) {
			if (item.isFinished() || !item.IsQuestActive()) { return; }
			$.each(item.mQuestDefinition.questTriggers_vector, function(n, trigger) {
				if(trigger.name_string != null && trigger.name_string != '')
					questTriggersMap[trigger.name_string] = true;
			});
		});
    }

    game.zone.mStreetDataMap.GetBuildings_vector().forEach(function(item){
        if (item === null) { return; }
        itemGOContainer = item.GetGOContainer();
        if (
            collectionsManager.getBuildingIsCollectible(item.GetBuildingName_string()) ||
            (
                questTriggersMap[item.GetBuildingName_string()] &&
                item.mIsSelectable &&
                itemGOContainer.mIsAttackable &&
                !itemGOContainer.mIsLeaderCamp &&
                itemGOContainer.ui !== "enemy" &&
                (item.GetArmy() == null || !item.GetArmy().HasUnits())
            )
        ) {
            queue.add(function(){
                game.gi.SelectBuilding(item);
            });
        }
    });

    if (queue.len() === 0) {
        showGameAlert(getText("NoCollectibles"));
        return;
    }
    showGameAlert(getText('command_sent'));
    queue.run();
}

function shortcutsFreeAllUnits()
{
	var queue = new TimedQueue(1000);
	swmmo.application.mGameInterface.mCurrentPlayerZone.GetSpecialists_vector().forEach(function(item){
		if (game.player.GetPlayerId() == item.getPlayerID() && 
		    armySPECIALIST_TYPE.IsGeneral(item.GetType()) && 
			item.GetGarrisonGridIdx() > 0  && item.HasUnits() && !item.IsInUse() && !item.isTravellingAway())
		{
			queue.add(function(){ armyMilitarySystem.SendRaiseArmyToServer(game.gi, item, null); });
		}
	});
	if(queue.len() > 0)
	{
		queue.add(function(){ game.showAlert(loca.GetText("LAB", "GuildQuestCompleted")); });
		queue.run();
		game.showAlert(getText('command_sent'));
	}
}

function shortcutsAddHandler(event)
{
	shortcutsWindow = new Modal('shortcutsWindow', utils.getImageTag('icon_advanced_paper_wholesale.png') + ' ' + getText('shortcutsTitle'));
	shortcutsWindow.create();
	
	if(shortcutsWindow.withHeader('.container-fluid').length == 0){
		var select = $('<select>', { id: 'shortcutsSelect', 'class': "form-control" }).append($('<option>', { value:"---" }).text("---"));
		shortcutsWindow.withHeader('').append($('<div>', { 'class': 'container-fluid' }).append([
			createTableRow([
				[2, getText('shortcutsFolder')],
				[6, select],
				[4, $('<center>').append($('<span>', { 'class': "shortcutsSaved", 'style': "display:none;" }).html("<b>{0}</b>".format(getText('shortcutsSaved')))) ]
			], true),
			createTableRow([[3, loca.GetText("LAB", "Type")],[5, getText('shortcutsFilename')],[4, '']], true)
		]));
		shortcutsWindow.withHeader('#shortcutsSelect').change(shortcutsUpdateView);
	}
	var groupSelect = $('<div>', { 'class': 'btn-group dropup' }).append([
		$('<button>').attr({ 
			"id": "shortcutsAddItem",
			"class": "btn btn-success shortcutsAddItem dropdown-toggle",
			'aria-haspopup': 'true',
			'style': 'margin-left: 4px;',
			'aria-expanded': 'false',
			'data-toggle': "dropdown"
		}).text(getText('shortcutsAddItem')), 
		$('<ul>', { 'class': 'dropdown-menu' }).append([
			$('<li>').html($('<a>', {'href': '#', 'name': 'geo'}).text(shortcutsTypesLang['g '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'expl'}).text(shortcutsTypesLang['e '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'buff'}).text(shortcutsTypesLang['b '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'bui'}).text(shortcutsTypesLang['p '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'army'}).text(shortcutsTypesLang['l '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'move'}).text(shortcutsTypesLang['m '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'battle'}).text(shortcutsTypesLang['a '])),
			$('<li>').html($('<a>', {'href': '#', 'name': 'sep'}).text(getText('shortcutsSeparator'))),
			$('<li>').html($('<a>', {'href': '#', 'name': 'folder'}).text(getText('shortcutsFolder')))
		])
	]);

//		$('<button>').attr({ "id": "shortcutsExport","class": "btn btn-primary pull-left"}).text("Export"),
//		$('<button>').attr({ "id": "shortcutsImport","class": "btn btn-primary pull-left"}).text("Import"),

	shortcutsWindow.Footer().prepend([
		$('<button>').attr({ "id": "shortcutsSave", "class": "btn btn-primary pull-left shortcutsSave" }).text(loca.GetText("LAB","GuildSave")),
		groupSelect
	]);
	shortcutsWindow.withFooter('#shortcutsExport').hide();
	shortcutsWindow.withFooter('#shortcutsExport').click(shortcutsExport);
	shortcutsWindow.withFooter('#shortcutsImport').click(shortcutsImport);
	shortcutsWindow.withFooter('.dropdown-menu a').click(function() {
		if(this.name == 'sep') {
			(shortcutsGetActive() && shortcutsGetActive().items || shortcutsSettings).push('--s'+Date.now()+'p--');
			shortcutsUpdateView();
			return;
		}
		if(this.name == 'folder') {
			var des = prompt("Folder name", '');
			if(des == null || des == "") { return; }
			var newid = Date.now();
			(shortcutsGetActive() && shortcutsGetActive().items || shortcutsSettings).push({
				'id' : newid,
				'name' : des,
				'items' : new Array()
			});
			shortcutsRefresh();
			shortcutsWindow.withHeader("#shortcutsSelect").val(newid).change();
			return;
		}
		shortcutsselectTextFile(this.name); 
	});
	var sortOrder = {};
	$.each(shortcutsWindow.withBody('.close'), function(i, item) { sortOrder[$(item).val()] = i; });
	shortcutsWindow.withFooter('.shortcutsSave').click(function(){
		var active = shortcutsGetActive();
		var sortOrder = {};
		$.each(shortcutsWindow.withBody('.close'), function(i, item) { sortOrder[$(item).val()] = i; });
		if (active != null) {
			active.items.sort(function(a,b) { return sortOrder[active.items.indexOf(a)] > sortOrder[active.items.indexOf(b)] ? 1 : -1; });
			$.each(shortcutsWindow.withBody('div.row'), function(i, item) { 
				if($(item).find('.form-control').length > 0) {
					active.items[i][1] = $(item).find('.form-control').val() || null;
				}
			});
		} else {
			shortcutsSettings.sort(function(a,b) { return sortOrder[shortcutsSettings.indexOf(a)] > sortOrder[shortcutsSettings.indexOf(b)] ? 1 : -1; });
			$.each(shortcutsWindow.withBody('div.row'), function(i, item) { 
				if($(item).find('.form-control').length > 0) {
					shortcutsSettings[i][1] = $(item).find('.form-control').val() || null;
				}
			});
		}
		settings.settings['shortcuts'] = [];
		storeSettings(shortcutsSettings, 'shortcuts');
		shortcutsMakeMenu();
		shortcutsWindow.withHeader('.shortcutsSaved').fadeIn();
		setTimeout(function() { shortcutsWindow.withHeader('.shortcutsSaved').fadeOut(); }, 1000);
	});

	shortcutsWindow.Body().html($('<div>', { 'id': 'shortcutsRows' }));
	shortcutsRefresh();
	shortcutsWindow.show();
}

function shortcutsRemoveRecursive(t, idToRemove) {
	for (i in t) {
		if(typeof t[i] == 'object'  && !Array.isArray(t[i])) {
			if(t[i].id == idToRemove) {
				t.splice(i, 1);
				continue;
			}
			shortcutsRemoveRecursive(t[i].items, idToRemove);
		}
	}
}

function shortcutsselectTextFile(type) 
{ 
    var txtFilter = new air.FileFilter("Template", "*.*");
	var root = new air.File();
	root.nativePath = readLastDir(type == 'move' ? 'army' : type);
    root.browseForOpenMultiple("Open", new window.runtime.Array(txtFilter)); 
    root.addEventListener(window.runtime.flash.events.FileListEvent.SELECT_MULTIPLE, function(event) {
		var nametotype = { 'buff': 'u', 'bui': 'p', 'battle': 'b' };
		event.files.forEach(function(item) {
			(shortcutsGetActive() && shortcutsGetActive().items || shortcutsSettings).push([item.nativePath + "[{0}]".format(nametotype[type] ? nametotype[type] : type.charAt(0)), null]);
		});
		shortcutsUpdateView();
	});
}

function shortcutsUpdateView()
{
	
	shortcutsWindow.withBody('#shortcutsRows').html("");
	var out = "";

	shortcutsGetActive()&&shortcutsWindow.withFooter('#shortcutsExport').show();
	(shortcutsGetActive() && shortcutsGetActive().items || shortcutsSettings).forEach(function(i, idx) {
		if(typeof i == 'object' && !Array.isArray(i)) { 
			out += createTableRow([
				[3, '&#8597;&nbsp;&nbsp;'+getText('shortcutsFolder')],
				[6, $('<span>', { 'class': 'folder', 'id': i.id, 'style': 'cursor:pointer;' }).text(i.name)],
				[3, $('<button>', { 'type': 'button', 'class': 'close', 'value': idx }).html($('<span>').html('&times;'))]
			], false);
		} else if(/--s[0-9]+p--/.test(i) || i == '--sep--') {
			out += createTableRow([
			[1, '&#8597;&nbsp;&nbsp;'],
			[10, $('<hr>', { 'style': 'margin: 10px 0;' })],
			[1,  $('<button>', { 'type': 'button', 'class': 'close', 'value': idx }).html($('<span>').html('&times;'))],
			], false);
		} else {
			var typename = shortcutsStripType(i[0].split("\\").pop());
			out += createTableRow([
				[3, '&#8597;&nbsp;&nbsp;' + shortcutsTypesLang[typename[1]]],
				[4, typename[0]],
				[3, $('<input>', { 'type': 'text', 'class': 'form-control', 'style': 'background:none;color:white;', 'value': i[1] == null ? '' : i[1] })],
				[2, $('<button>', { 'type': 'button', 'class': 'close', 'value': idx }).html($('<span>').html('&times;'))],
			], false);
		}
	});
	shortcutsWindow.withBody('#shortcutsRows').html($('<div>', { 'class': "container-fluid", 'style': "user-select: none;cursor:move;" }).html(out));
	shortcutsWindow.withBody('.close').click(function(e){
		var actVal = shortcutsWindow.withHeader('#shortcutsSelect').val();
		(shortcutsGetActive() && shortcutsGetActive().items || shortcutsSettings).splice(parseInt($(this).val()), 1);
		shortcutsRefresh();
		if(actVal != 'root') {
			shortcutsWindow.withHeader('#shortcutsSelect').val(actVal).change();
		}
	});
	shortcutsWindow.withBody('.container-fluid').sortable();
	shortcutsWindow.withBody('.folder').click(function(e){
		shortcutsWindow.withHeader("#shortcutsSelect").val(this.id).change();
	});
}

function shortcutsGetActive()
{
	if(shortcutsWindow.withHeader('#shortcutsSelect option:selected').val() == '---') { return null; }
	return shortcutsGetActiveRecursive(shortcutsSettings, shortcutsWindow.withHeader('#shortcutsSelect option:selected').val());
}

function shortcutsGetActiveRecursive(t, s)
{
	var result = null;
	for(n in t) {
		if (t[n].id == s) return t[n];
		t[n].items.forEach(function(item){
			if(typeof item == 'object' && !Array.isArray(item))
				result = shortcutsGetActiveRecursive([item], s) || result;
		});
	};
	return result;
}


function shortcutsRefresh()
{
	shortcutsWindow.withHeader('#shortcutsSelect').html('');
	shortcutsWindow.withHeader('#shortcutsSelect').append($('<option>', { value:"---" }).text("root"));
	shortcutsSettings.forEach(function(item){
		shortcutsWindow.withHeader('#shortcutsSelect').append($('<option>', { value: item.id }).text(item.name));
		for (i in item.items) {
			if(typeof item.items[i] == 'object' && !Array.isArray(item.items[i])) {
				shortcutsRefreshRecursive(item.items[i], [item.name], 1);
			}
		}
	});
	shortcutsUpdateView();
}

function shortcutsRefreshRecursive(t, dim, depth)
{
	dim = dim.slice(0, depth);
	dim.push(t.name);
	shortcutsWindow.withHeader('#shortcutsSelect').append($('<option>', { value: t.id }).text(dim.join(" > ")));
	for (i in t.items) {
		if(typeof t.items[i] == 'object' && !Array.isArray(t.items[i])) {
			shortcutsRefreshRecursive(t.items[i], dim, ++depth);
		}
	}
}

function shortcutsImport()
{
	var exportSource = new SaveLoadTemplate('short', function(data) {
		if(!data.tree || !data.content) {
			showGameAlert(getText("bad_template"));
			return;
		}
		shortcutsImportProceed(data);
	});
	exportSource.load();
}

function shortcutsImportMakeSelect()
{
	var select = $('<select>', { 'class': "form-control" });
	game.zone.GetSpecialists_vector().sort(specNameSorter).forEach(function(item){
			if(!armySPECIALIST_TYPE.IsGeneralOrAdmiral(item.GetType()) || item.getPlayerID() == -1) { return; }
			select.append($('<option>', { value: item.GetUniqueID().toKeyString(), id: item.GetType() }).text(item.getName(false).replace(/(<([^>]+)>)/gi, "")));
	});
	return select;
}

function shortcutsImportFilterSelect(select, type)
{
	var result = select.clone();
	result.find('option[id!="'+type+'"]').remove();
	result.prepend($('<option>', { value: 0 }).text("Choose"));
	return result.find('option').length == 1 ? getGext('NoData') : result;
}

function shortcutsImportProceed(data)
{
	shortcutsImportedTree = data.tree;
	shortcutsImportedGens = shortcutsImportGetGens(data.content);
	shortcutsWindow.settings(function() { }, 'modal-lg');
	shortcutsWindow.sDialog().css("height", "80%");
	shortcutsWindow.sTitle().html("Import node {0} ({1} templates)".format(data.tree.name, Object.keys(data.content).length));
	shortcutsWindow.sFooter().find('.pull-left').hide();
	var out = '';
	var select = shortcutsImportMakeSelect();
	out += "<H4>Generals comparator</H4>" + createTableRow([[5, "template"],[1, "match"],[6, "ur possible gen"]], true);
	$.each(shortcutsImportedGens, function(item) {
		out += createTableRow([
			[5, shortcutsImportedGens[item].name],
			[1, "-", 'match'],
			[6, shortcutsImportFilterSelect(select, shortcutsImportedGens[item].type), item]
		], false);
	});
	shortcutsWindow.sBody().html($('<div>', { 'class': "container-fluid", 'style': "user-select: none;" }).html(out));
	shortcutsWindow.sBody().find('select').change(shortcutsImportMatch);
	$('#' + shortcutsWindow.rawsId).modal({backdrop: "static"});
}

function shortcutsImportMatch()
{
	var selected = $(this).val();
	var compared = $(this).closest('div').attr('class').split(' ').pop();
	if(selected == 0) { 
		$(this).closest('div.row').find('.match').html("");
		return;
	}
	var spec = armyGetSpecialistFromID($(this).val());
	var match = true;
	if(spec != null) {
		var skills = spec.getSkillTree().getItems_vector();
		$.each(shortcutsImportedGens[compared].skills, function(index, item) {
			if(item > skill[index].getLevel()) {
				match = false;
			}
		});
	}
	$(this).closest('div.row').find('.match').html(match ? 'ok' : 'fail');
}

function shortcutsExport()
{
	if(!shortcutsGetActive()) {
		alert("You cant export root");
		return;
	}
	var dataToexport = JSON.parse(JSON.stringify(shortcutsGetActive())),
		skippedTemplates = [],
		exportedContent = {},
		exportStatus = shortcutsExportTree(dataToexport, exportedContent, skippedTemplates);
	if(exportStatus == true) {
		if(skippedTemplates.length > 0) {
			shortcutsWindow.settings(function() { shortcutsExportFinal({ 'tree': dataToexport, 'content': exportedContent }); }, '');
			shortcutsWindow.sDialog().css("height", "80%");
			shortcutsWindow.sTitle().html("Skipped templates");
			var out = createTableRow([[10, "Filename"],[2, "Reason"]], true);
			for(tmpl in skippedTemplates) {
				out += createTableRow([[10, skippedTemplates[tmpl][0]],[2, skippedTemplates[tmpl][1]]], false);
			}
			shortcutsWindow.sBody().html($('<div>', { 'class': "container-fluid", 'style': "user-select: none;cursor:move;" }).html(out));
			$('#' + shortcutsWindow.rawsId).modal({backdrop: "static"});
			return;
		}
		shortcutsExportFinal({ 'tree': dataToexport, 'content': exportedContent })
	}
}

function shortcutsExportFinal(data)
{
	if($('#' + shortcutsWindow.rawsId).length > 0) {
		$('#' + shortcutsWindow.rawsId).modal('hide');
	}
	var file = air.File.documentsDirectory.resolvePath(data.tree.name + '_export.data');
	file.save(JSON.stringify(data));
}

function shortcutsExportTree(t, content, skipped)
{
	for (i in t.items) {
		if(typeof t.items[i] == 'string') { continue; }
		if(!Array.isArray(t.items[i])) { 
			if(!shortcutsExportTree(t.items[i], content, skipped))
				return false;
			continue;
		}
		var data = shortcutsExportGetTemplateData(t.items[i][0].slice(0, -3));
		if(typeof data == 'object') {
			var file = t.items[i][0].split("\\").pop();
			content[file.slice(0, -3)] = data;
			t.items[i][0] = file;
		} else {
			skipped.push([t.items[i][0].slice(0, -3), data]);
			delete t.items[i];
		}
	}
	t.items = t.items.filter(function(e) { return e != null; });
	return true;
}

function shortcutsExportGetTemplateData(filepath)
{
	try {
		var file = new air.File(filepath);
		if(!file.exists) { return "not exists"; }
		var fileStream = new air.FileStream();
		fileStream.open(file, air.FileMode.READ);
		var data = fileStream.readUTFBytes(file.size);
		fileStream.close();
		if (data == "") { return "empty"; }
		data = JSON.parse(data);
		if(!data[Object.keys(data)[0]].skills) { return "bad format"; }
		return data;
	} catch(e) { return "error"; }
}

function shortcutsImportGetGens(data)
{
	var result = { };
	$.each(data, function(item) { 
		$.each(data[item], function(spec) { 
		result[spec] = { 'type': data[item][spec].type, 'skills': data[item][spec].skills, 'name': data[item][spec].name };
	});});
	$.each(result.battle, function(item) {
		if(result.army[item]) { delete result.army[item]; }
	});
	return result;
}