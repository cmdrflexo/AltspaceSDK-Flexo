
var modelsURL = "https://cmdrflexo.github.io/AltspaceSDK-Flexo/examples/flexo/flexorama/models/avatars/";

var avatarSIDs = [
    "a-series-m01",               // 0
    "pod-classic",                // 1
    "robothead-propellerhead-01", // 2
    "robothead-roundguy-01",      // 3
    "rubenoid-female-01",         // 4
    "rubenoid-male-01",           // 5
    "s-series-f01",               // 6
    "s-series-m01",               // 7
    "x-series-m02"                // 8
];

var avatarClassification = {
    "a-series-m01" : 0,
    "s-series-f01" : 0,
    "s-series-m01" : 0,
    "x-series-m02" : 0,
    "pod-classic"  : 0,
    "rubenoid-female-01" : 1,
    "rubenoid-male-01"   : 1,
    "robothead-propellerhead-01" : 2,
    "robothead-roundguy-01" : 3
};

var modelNames = {
    seriesHead        : "head",
    seriesHeadHL      : "head_highlight",
    seriesBody        : "body",
    seriesBodyHL      : "body_hightlight",
    roundguyHead      : "head",
    roundguyBody      : "body",
    propellerheadHead : "head",
    rubenoidHead      : "head",
    rubenoidBody      : "body"
};

var avatar = {
    sid      : null,
    type     : null,
    head     : null,
    body     : null,
    pColor   : null,
    hColor   : null
};

function GetAvatar(avatarInfo) {
    avatar.sid = avatarInfo.sid;
    avatar.type = avatarClassification[avatarInfo.sid];
    // wait for models
    GetAvatarModels(avatarInfo);
};

function GetAvatarModels() {
    var loader = new altspace.utilities.shims.OBJMTLLoader();
    var modelLocation = modelsURL + avatar.sid + "/";
    switch(avatar.type) {
        case 0: // series
            GetColors(avatarInfo);
            loader.load(
                modelLocation + modelNames.seriesHead + ".obj", 
                modelLocation + modelNames.seriesHead + ".mtl",
                function(head) {
                    loader.load(
                        modelLocation + modelNames.seriesHeadHL + ".obj", 
                        modelLocation + modelNames.seriesHeadHL + ".mtl",
                        function(headHL) { head.add(headHL); }
                    );
                    loader.load(
                        modelLocation + modelNames.seriesBody + ".obj", 
                        modelLocation + modelNames.seriesBody + ".mtl",
                        function(body) { 
                            loader.load(
                                modelLocation + modelNames.seriesBodyHL + ".obj", 
                                modelLocation + modelNames.seriesBodyHL + ".mtl",
                                function(bodyHL) { 
                                    body.add(bodyHL); 
                                    AvatarModelLoaded(head, body);
                                }
                            ); 
                        }
                    );
                }
            );
            break;
        case 1: case 3: // roundguy, rubenoid
            var locHead = modelLocation + (
                avatar.type == 1 ?
                    modelNames.roundguyHead :
                    modelNames.rubenoidHead + "."
            );
            var locBody = modelLocation + (
                avatar.type == 1 ?
                    modelNames.roundguyBody :
                    modelNames.rubenoidBody + "."
            );
            loader.load(
                locHead + "obj", locHead + "mtl",
                function(head) {
                    loader.load(
                        locBody + "obj", locBody + "mtl",
                        function(body) {
                            AvatarModelLoaded(head, body);
                        }
                    );
                }
            );
            break;
        case 2: // propellerhead
            var loc = modelLocation + modelNames.propellerhead + ".";
            loader.load(
                loc + "obj", loc + "mtl",
                function(head) { 
                    avatar.head = head; 
                    AvatarModelLoaded(head);
                }
            );
            break;
    }
}

function GetColors(avatarInfo) {
    avatar.hColor = ReduceColor(avatarInfo.highlightColor.match(/\d+/g).map(Number));
    switch(avatarInfo.primaryColor) {
        case "white": case "lightgrey": avatar.pColor = [255, 255, 255]; return;
        case "grey":     avatar.pColor = [191, 191, 191]; return;
        case "darkgrey": avatar.pColor = [ 77,  77,  77]; return;
        case "black":    avatar.pColor = [ 26,  26,  26]; return;
    }
    // ///
    console.log("Primary color not preset");
    // ///
    avatar.pColor = ReduceColor(avatarInfo.primaryColor.match(/\d+/g).map(Number));
}

function ReduceColor(color) {
    var max = Math.max(color[0], color[1], color[2]);
    if(max > 255)
        for(var i = 0; i < 3; i++)
            color[i] = Math.floor(color[i] / max * 255);
    return color;
}

function AvatarModelLoaded(head, body = null) {
    avatar.head = head;
    avatar.body = body;
}
