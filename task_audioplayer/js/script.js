/**
 * Created by cycbot on 2017/4/18.
 */
var playStatus = {
    currentTrackLen: playlist.result.tracks.length,
    currentTrackIndex: 0,
    currentTime: 0,
    currentTotalTime: 0,
    playStatus: true
};

var timeConvert = function (timestamp) {
    var minutes = Math.floor(timestamp / 60);
    var seconds = Math.floor(timestamp - (minutes * 60));

    if(seconds < 10) {
        seconds = '0' + seconds;
    }

    timestamp = minutes + ':' + seconds;
    return timestamp;
};

var playerControls = {
    trackInfo: function (args) {
        var obj = playlist.result.tracks[playStatus.currentTrackIndex];

        args = args || {
            name: obj.name,
            artist: obj.artists[0].name,
            album: obj.album.name,
            albumPic: obj.album.picUrl + '?param=270y270',
            total: obj.duration,
            src: obj.mp3Url
        };

        $('.player .trackInfo .name').text(args.name);
        $('.player .trackInfo .artist').text(args.artist);
        $('.player .trackInfo .album').text(args.album);
        $('.player .albumPic').css('background', 'url(' + args.albumPic + ')');
        $('.player .time .total').text(timeConvert(args.total / 1000));
        playStatus.currentTotalTime = Math.floor(args.total / 1000);
        $('#audio source').attr('src', args.src);
    },

    playStatus: function () {
        $('.player .controls .play i').attr('class', 'icon-' + (playStatus.playStatus?'pause':'play'));

    }
};