"use strict";
( function( window ) {

    window.track_count=0;

    window.newTrack = function() {
        window.track_count++;
        return window.track_count;
    }
    window.debug = {
        log: function (x) {
            println(JSON.stringify(x))
        }
    }
    window.mergeObjects = function() {
        var resObj = {};
        for(var i=0; i < arguments.length; i += 1) {
             var obj = arguments[i],
                 keys = Object.keys(obj);
             for(var j=0; j < keys.length; j += 1) {
                 resObj[keys[j]] = obj[keys[j]];
             }
        }
        return resObj;
    }

}( typeof window === "undefined" ? global : window ) );

if (typeof debug === "undefined") {
    var debug = window.debug;
}
if (typeof newTrack === "undefined") {
    var newTrack = window.newTrack;
}
if (typeof mergeObjects === "undefined") {
    var mergeObjects = window.mergeObjects;
}
/// Utility Methods
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    if (this === null)
      throw new TypeError('can\'t convert ' + this + ' to object');

    var str = '' + this;
    // To convert string to integer.
    count = +count;
    // Check NaN
    if (count != count)
      count = 0;

    if (count < 0)
      throw new RangeError('repeat count must be non-negative');

    if (count == Infinity)
      throw new RangeError('repeat count must be less than infinity');

    count = Math.floor(count);
    if (str.length === 0 || count === 0)
      return '';

    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28)
      throw new RangeError('repeat count must not overflow maximum string size');

    var maxCount = str.length * count;
    count = Math.floor(Math.log(count) / Math.log(2));
    while (count) {
       str += str;
       count--;
    }
    str += str.substring(0, maxCount - str.length);
    return str;
  }
}

// Most Common Rap Song Structure
// (pre-chorus might replace a couple measures at the end of a verse)
// Verse – Chorus – Verse – Chorus
// Verse – Chorus – Verse – Chorus – Bridge – Chorus
// Verse – Chorus – Verse – Chorus – Verse – Chorus
// Verse – Verse – Bridge – Verse



function ComponentPatterns() {
  this.melody = "";
  this.rhythm = "";
  this.drums = "";
  this.sfx = "";
}

ComponentPatterns.prototype.getMelody = function() {
  return this.melody;
};
ComponentPatterns.prototype.setMelody = function(pattern) {
    this.melody = pattern;
    return this.melody;
};
ComponentPatterns.prototype.getRhythm = function() {
  return this.rhythm;
};
ComponentPatterns.prototype.setMelody = function(pattern) {
    this.melody = pattern;
    return this.melody;
};
ComponentPatterns.prototype.getDrums = function() {
  return this.drums;
};
ComponentPatterns.prototype.setMelody = function(pattern) {
    this.melody = pattern;
    return this.melody;
};
ComponentPatterns.prototype.getSfx = function() {
  return this.sfx;
};



function SongComponent(type) {
    var scType = type || "untracked";
    this[scType] = new SongComponentCore();
}

SongComponent.prototype.getBars = function() {
  return this.bars;
};
SongComponent.prototype.setBars = function(bars) {
    this.bars = bars;
    return this.bars;
};
SongComponent.prototype.getTrack = function() {
  return this.track;
};
SongComponent.prototype.setTrack = function(track) {
    this.track = track;
    return this.track;
};

function SongComponentCore(bars,track) {
    var self = this;
    self.bars = bars || 8;
    self.track = track || newTrack();
    self.patterns = new ComponentPatterns();
}

function CompleteSong() {
    var self = this;

    self.copyright = {
        name: 'song-name',
        year: 2021,
        author: 'x'
    }
    self.tempo = 89;
    self.trackTypes = ['melody','rhythm','bass','sfx','drums','drums-kick','drums-snare','drums-hihat'];
    self.tracks = {};
    self.stats = {};

    self.structure = ['intro','outro'];
    self.structureComponents = {};

    return self;
}

CompleteSong.prototype.setStructure = function(structureList) {
    this.structure = structureList;
    return this;
}
CompleteSong.prototype.getCopyright = function() {
  return this.copyright;
};

CompleteSong.prototype.getName = function() {
  return this.copyright.name;
};

CompleteSong.prototype.getYear = function() {
  return this.copyright.year;
};

CompleteSong.prototype.getAuthor = function() {
  return this.copyright.author;
};

CompleteSong.prototype.setupTracks = function(){
    var self = this;
    for(var c=0;c<self.trackTypes.length;c++) {
        self.tracks[self.trackTypes[c]] = {};
        self.tracks[self.trackTypes[c]].trackNumber = newTrack();
    }
    return self;
}

CompleteSong.prototype.setupStructureComponent = function(structureComponent){
    var self = this;
    self.structureComponents[structureComponent] = self[structureComponent] || {};
    self.structureComponents[structureComponent].bars = self.structureComponents[structureComponent].bars || 8;
    for(var c=0;c<self.trackTypes.length;c++) {
        self.structureComponents[structureComponent][self.trackTypes[c]] = {};
        self.structureComponents[structureComponent][self.trackTypes[c]].trackNumber = self.tracks[self.trackTypes[c]].trackNumber;
        self.structureComponents[structureComponent][self.trackTypes[c]].fileName = "";
        self.structureComponents[structureComponent][self.trackTypes[c]].pattern = "";
        self.structureComponents[structureComponent][self.trackTypes[c]].isFitMedia = false;
    }
    return self;
}


CompleteSong.prototype.initStructureComponent = function(structureComponent) {
    var self = this;
    var type = {};
    type[structureComponent] = new SongComponentCore(2);
    if(!self.structureComponents[structureComponent]) {
        self.structureComponents = mergeObjects(self.structureComponents,type)
    }
    return self;
}

CompleteSong.prototype.setPattern = function(structureComponent,type,pattern){
    var self = this;
    self.structureComponents[structureComponent][type].pattern = pattern;
    return self;
};
CompleteSong.prototype.setFilename = function(structureComponent,type,fileName,isFitMedia){
    var self = this;
    self.structureComponents[structureComponent][type].isFitMedia = isFitMedia || false;
    self.structureComponents[structureComponent][type].fileName = fileName;
    return self;
};
CompleteSong.prototype.build = function(){
    var self = this;
    var currentBar = 1;
    var bars = 0;
    for (var i = 0; i < self.structure.length; i++) {
        debug.log(self.structure[i]);
        for(var tt = 0; tt<self.trackTypes.length; tt++){
            try {
                bars = self.structureComponents[self.structure[i]].bars;
                var track = self.structureComponents[self.structure[i]][self.trackTypes[tt]];
                debug.log(track);
                if(track.fileName !== "") {
                    debug.log(track);
                    if(track.isFitMedia && track.pattern.length > 0) {
                        makeBeatSlice(track.fileName, track.trackNumber, currentBar, track.pattern, [1,1.25,1.5,1.75,2,2.25,2.5,2.75]);
                    }
                    else if(track.isFitMedia){
                        fitMedia(track.fileName, track.trackNumber, currentBar, currentBar + bars);
                    }
                    else {
                        makeBeat(track.fileName, track.trackNumber, currentBar, track.pattern);
                    }
                }
            }
            catch (error) {
                debug.log(error);
            }

        }
        currentBar += bars;
        debug.log(currentBar);
        bars = 0;
    }
    //self.structureComponents[structureComponent][type].fileName = fileName;
    return self;
};













// debug.log(new SongComponent());
// SongComponent.prototype.getType = function() {
//   return this.type;
// };




//Object.assign(song.components,new SongComponent('intro'));
// the A-B-A-B-C-B form was the most popular (verse – chorus – verse – chorus – bridge – chorus).
// All of the songs contain an intro, the majority feature a bridge, half contain a pre-chorus and outro,
// and none contain a prominent instrumental and/or vocal break within the mix.


function getSongStatsObj(song){
    var statsObj = {};
    statsObj.quarterNoteLength = 60000/song.tempo;
    statsObj.barLength = 60000/song.tempo*4;
    statsObj.songLength = getTotalBars(song)*statsObj.barLength;
    statsObj.songLengthFullMinutes = Math.floor(statsObj.songLength/60000);
    statsObj.songLengthSecondsRemaining = Math.abs(((statsObj.songLength % 60000) / 1000).toFixed(0));
    statsObj.songLengthMinutesAndSeconds = statsObj.songLengthFullMinutes+":"+statsObj.songLengthSecondsRemaining;
    return statsObj;
}

function getTotalBars (song) {
    var sum = 0;
    var songStruc = song.structure;
    var songComponents = song.components;
    for (var component = 0; component < songForm.length; component++) {
        sum += (songComponents[songForm[component]].bars);
    }
    return sum;
}

function getRandomBar(totalBars){
    return Math.ceil(Math.random()*totalBars);
}

init();


function shuffleString(str) {
    var a = str.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
// waveforms
https://api.ersktch.gatech.edu/EarSketchWS/audio/sample?name=RD_POP_SYNTHBASS_6


var mySong = new CompleteSong();

// mySong.structure = ['intro','verse','chorus','verse','chorus','bridge','chorus','outro'];
// mySong.setStructure(['intro','verse','chorus','verse','chorus','bridge','chorus','outro']);
mySong.setStructure(['intro','verse','chorus','verse','chorus','outro','outro2']);
mySong.setupTracks();
mySong.setupStructureComponent('intro');
mySong.setupStructureComponent('verse');
mySong.setupStructureComponent('chorus');
mySong.setupStructureComponent('outro');
mySong.setupStructureComponent('outro2');
// mySong.setupStructureComponent('outro');
// mySong.initStructureComponent('intro');
// mySong.setPattern('intro','drums-kick','0---0-0-00--0--0'.repeat(8));
// mySong.setFilename('intro','drums-kick',AK_UNDOG_PERC_KICK_1);
// var pixelData = importImage("https://cdn.pixabay.com/photo/2012/04/05/01/17/ear-25595_640.png", 10, 10);
// println(pixelData);
var introBars = 4;
mySong.structureComponents['intro'].bars=introBars;
mySong.setPattern('intro','drums-kick',shuffleString("01234567++++++++").repeat(introBars));
mySong.setFilename('intro','drums-kick',HOUSE_BREAKBEAT_023,true);
// mySong.setPattern('intro','sfx',shuffleString('0+4-5-+3+1+67+++').repeat(introBars));
// mySong.setFilename('intro','sfx',RD_CINEMATIC_SCORE_STRINGS_2,true);
// mySong.setPattern('intro','rhythm',shuffleString('0+4-5-+3+1+67+++').repeat(introBars));
// mySong.setFilename('intro','rhythm',RD_CINEMATIC_SCORE_HARP_1,true);
mySong.setPattern('intro','bass',shuffleString('0+4-5-+3+1+67+++').repeat(introBars));
mySong.setFilename('intro','bass',ELECTRO_ANALOGUE_BASS_003,true);

var verseBars = 8;
mySong.structureComponents['verse'].bars=verseBars;
mySong.setPattern('verse','drums-kick',shuffleString('01234567++++++++').repeat(verseBars));
mySong.setFilename('verse','drums-kick',HOUSE_BREAKBEAT_023,true);
mySong.setPattern('verse','sfx',shuffleString('0+4-5-+3+1+67+++').repeat(verseBars));
mySong.setFilename('verse','sfx',RD_CINEMATIC_SCORE_STRINGS_6,true);
mySong.setPattern('verse','rhythm',shuffleString('0+4-5-+3+1+67+++').repeat(verseBars));
mySong.setFilename('verse','rhythm',HIPHOP_DUSTYGUITAR_001,true);
mySong.setPattern('verse','bass',shuffleString('0+4-5-+3+1+67+++').repeat(verseBars));
mySong.setFilename('verse','bass',HOUSE_DEEP_BASS_003,true);

var chorusBars = 8;
mySong.structureComponents['chorus'].bars=chorusBars;
mySong.setPattern('chorus','drums-kick',shuffleString('01234567++++++++').repeat(chorusBars));
mySong.setFilename('chorus','drums-kick',HOUSE_BREAKBEAT_023,true);
mySong.setPattern('chorus','sfx',shuffleString('0+4-5-+3+1+67+++').repeat(chorusBars));
mySong.setFilename('chorus','sfx',RD_CINEMATIC_SCORE_STRINGS_2,true);
mySong.setPattern('chorus','rhythm',shuffleString('0+4-5-+3+1+67+++').repeat(chorusBars));
mySong.setFilename('chorus','rhythm',HIPHOP_DUSTYGUITAR_001,true);
mySong.setPattern('chorus','bass',shuffleString('0+4-5-+3+1+67+++').repeat(chorusBars));
mySong.setFilename('chorus','bass',HOUSE_DEEP_BASS_002,true);

var outroBars = 4;
mySong.structureComponents['outro'].bars=outroBars;
mySong.setPattern('outro','drums-kick',shuffleString('01234567++++++++').repeat(outroBars));
mySong.setFilename('outro','drums-kick',HOUSE_BREAKBEAT_026,true);
mySong.setPattern('outro','sfx',shuffleString('0+4-5-+3+1+67+++').repeat(outroBars));
mySong.setFilename('outro','sfx',RD_CINEMATIC_SCORE_STRINGS_6,true);
// mySong.setPattern('outro','rhythm',shuffleString('0+4-5-+3+1+67+++').repeat(outroBars));
// mySong.setFilename('outro','rhythm',HIPHOP_DUSTYGUITAR_002,true);
mySong.setPattern('outro','bass',shuffleString('0+4-5-+3+1+67+++').repeat(outroBars));
mySong.setFilename('outro','bass',HOUSE_DEEP_BASS_004,true);

var outro2Bars = 2;
mySong.structureComponents['outro2'].bars=outro2Bars;
mySong.setPattern('outro2','drums-kick',shuffleString('01234567++++++++').repeat(outro2Bars));
mySong.setFilename('outro2','drums-kick',HOUSE_BREAKBEAT_023,true);
// mySong.setPattern('outro2','sfx',shuffleString('0+4-5-+3+1+67+++').repeat(outroBars));
// mySong.setFilename('outro2','sfx',RD_CINEMATIC_SCORE_STRINGS_6,true);
// mySong.setPattern('outro2','rhythm',shuffleString('0+4-5-+3+1+67+++').repeat(outro2Bars));
// mySong.setFilename('outro2','rhythm',HIPHOP_DUSTYGUITAR_002,true);
mySong.setPattern('outro2','bass',shuffleString('0+4-5-+3+1+27+++').repeat(outro2Bars));
mySong.setFilename('outro2','bass',HOUSE_DEEP_BASS_004,true);



// mySong.setPattern('intro','drums-snare',shuffleString('0---0-0-00--0000').repeat(8));
// mySong.setFilename('intro','drums-snare',CIARA_ROOTED_DRUMBEAT_2,true);
// mySong.setPattern('outro','drums-kick','0---0-0-00--0--0'.repeat(8));
// mySong.setFilename('outro','drums-kick',CIARA_SET_KICK_1);
// mySong.setPattern('outro','drums-snare',shuffleString('0---0-0-----0--0').repeat(8));
// mySong.setFilename('outro','drums-snare',CIARA_ROOTED_DRUMBEAT_2);
setTempo(mySong.tempo);
mySong.build();
// song.stats=getSongStatsObj(song);
// println(song.components.intro.track);
// song.components.intro.pattern.setMelody("1+++");
// song.components.outro.patterns.setMelody("2+++");
// debug.log(song);

// Add Sounds

// function verse_drums(measures,shouldRandomizePattern){
//     var currentTrack = new_track();
//     if(shouldRandomizePattern) {
//         for (var measure=1; measure<measures+1; measure++) {
//           makeBeatSlice(RD_UK_HOUSE_MAINBEAT_13, currentTrack, measure, shuffleString("01234567++++++++"), [1,1.25,1.5,1.75,2,2.25,2.5,2.75]);
//         }
//     } else {
//         for (var measure=1; measure<measures+1; measure++) {
//           makeBeatSlice(RD_UK_HOUSE_MAINBEAT_8, currentTrack, measure, "0+++1---1+", [1,1.5]);
//         }
//     }
// }

// fitMedia(RD_UK_HOUSE_MAINBEAT_5, new_track(), 1, 9);
// verse_drums(8,1);
//makeBeatSlice(RD_UK_HOUSE_MAINBEAT_8, 1, 2, "0+----------2++++++++++", [1,1.5,2.75]);
// fitMedia(RD_POP_SYNTHBASS_6, new_track(), 1, 9);
// fitMedia(YG_RNB_TAMBOURINE_1, new_track(), 1, 9);
// fitMedia(YG_FUNK_CONGAS_3, new_track(), 1, 5);
// fitMedia(YG_FUNK_HIHAT_2, new_track(), 5, 9);
// var leadTrack = new_track();
// fitMedia(RD_POP_TB303LEAD_2, leadTrack, 5, 9);
// setEffect(leadTrack,PHASER,PHASER_RATE,0,1,0,5);
// setEffect(leadTrack,PHASER,PHASER_RATE,7,5,7,9);
// setEffect(leadTrack,RINGMOD,RINGMOD_MODFREQ,70.0);


//setEffect(4,DELAY,DELAY_TIME,20);
//setEffect(4,DELAY,DELAY_FEEDBACK,-1.6);
// setEffect(2,DELAY,MIX,1.0);
// setEffect(4,RINGMOD,RINGMOD_MODFREQ,70.0);

// setEffect(2, TREMOLO, TREMOLO_FREQ, 10.0);
// setEffect(2, REVERB, REVERB_TIME, 3200.0);
// setEffect(2, VOLUME, GAIN, -20);
setEffect(2, VOLUME, GAIN, -10);
setEffect(4, VOLUME, GAIN, -7);
//
// setEffect(2, FLANGER, FLANGER_LENGTH, 23.0);
// setEffect(3, REVERB, REVERB_TIME, 1.0);
// setEffect(3, VOLUME, GAIN, -5.0);

// setEffect(4, FLANGER, FLANGER_LENGTH, 23.0);
// setEffect(4, REVERB, REVERB_TIME, 3700.0);
// setEffect(4, VOLUME, GAIN, -15.0);

// setEffect(4, REVERB, REVERB_TIME, 3700.0);
// setEffect(6, REVERB, REVERB_TIME, 100.0);
// setEffect(6, VOLUME, GAIN, -17.0);
// setEffect(6, DELAY, DELAY_TIME, 100.0);
// setEffect(6, FLANGER, FLANGER_LENGTH, 23.0);
// setEffect(2,CHORUS,CHORUS_LENGTH,100.0);
// setEffect(2,CHORUS,CHORUS_NUMVOICES,2);
// setEffect(2,TREMOLO,TREMOLO_FREQ,30);
// setEffect(2,RINGMOD,RINGMOD_FEEDBACK,40);
// setEffect(2,VOLUME,GAIN,-5);
// Effects fade in
// setEffect(3, VOLUME,GAIN, -20, 1, 6, 5);

// Fills
// var fillA = "0---0-0-00--0000";
// var fillB = "0--0--0--0--0-0-";
// var fillC = "--000-00-00-0-00";

// var track_coreDrums = new_track();
// makeBeat(OS_SNARE03, track_coreDrums, measure_random(), shuffleString(fillA));
// makeBeat(CIARA_SET_KICK_1, track_coreDrums, measure_random(), shuffleString(fillB));
// makeBeat(CIARA_SET_KICK_1, track_coreDrums, measure_random(), shuffleString(fillC));

finish();
