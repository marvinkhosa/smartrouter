var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        if (localStorage.getItem('iden')) {
            $('#iden').val(localStorage.getItem('iden'))
        }
        if (localStorage.getItem('serverurl')) {
            $('#serverurl').val(localStorage.getItem('serverurl'))
        }
        if (localStorage.getItem('freq')) {
            $('#freq').val(localStorage.getItem('freq'))
        }
        if (localStorage.getItem('starttracking') == 'true') {
            document.getElementById('starttrackingblk').style.display = 'none';
            document.getElementById('stoptrackingblk').style.display = 'block';
        } else {
            document.getElementById('starttrackingblk').style.display = 'block';
            document.getElementById('stoptrackingblk').style.display = 'none';
        }
        document.getElementById("srttrack").addEventListener("click", dialogConfirmstart);
        document.getElementById("stptrack").addEventListener("click", dialogConfirmstop);
        document.getElementById("clrlog").addEventListener("click", clrlog);
        document.getElementById("showmodel").addEventListener("click", showmodel);
        document.getElementById("identifier").addEventListener("click", identifiersave);
    },
};
app.initialize();


function dialogConfirmstart() {
    if(localStorage.getItem('iden') && localStorage.getItem('serverurl')) { 
       var message = "Are you sure want to start tracking?";
       var title = "CONFIRM";
       var buttonLabels = "NO,YES";
       navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
       function confirmCallback(buttonIndex) {
        if(buttonIndex==2) { 
          watchPosition()
        }
      }
    } else {
      if(localStorage.getItem('serverurl')==false) {
      	 navigator.notification.alert('Please add server URL', '', 'Warning', 'OK');
      } else if(localStorage.getItem('iden')==false) {
      	 navigator.notification.alert('Please add device identifier', '', 'Warning', 'OK');
      } else {
      	navigator.notification.alert('Please add server URL and device identifier', '', 'Warning', 'OK');
      }
    }
}

function dialogConfirmstop() {
   var message = "Are you sure want to stop tracking?";
   var title = "CONFIRM";
   var buttonLabels = "NO,YES";
   navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
   function confirmCallback(buttonIndex) {
    if(buttonIndex==2) { 
      stoptracking()
    }
   }
}

function watchPosition() {
    var lastUpdateTime;
    minFrequency  = localStorage.getItem('freq')*1000;
    navigator.notification.beep(1);
    var options = {
        maximumAge: 3600000,
        timeout: 3000,
        enableHighAccuracy: true,
    }
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    localStorage.setItem('starttracking', 'true');
    localStorage.setItem('watchID', watchID);
    cordova.plugins.backgroundMode.enable();
    cordova.plugins.backgroundMode.overrideBackButton();
    cordova.plugins.backgroundMode.excludeFromTaskList();

    cordova.plugins.backgroundMode.on('activate', function() {
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
    });
    document.getElementById('starttrackingblk').style.display = 'none';
    document.getElementById('stoptrackingblk').style.display = 'block';

    function onSuccess(position) {
        if (position.coords.latitude != localStorage.getItem('latitude')) {
            var now = new Date();
            if(lastUpdateTime && now.getTime() - lastUpdateTime.getTime() < minFrequency) {
                logshow('position ignored')
                return;
            } else {
                localStorage.setItem('latitude', position.coords.latitude);
                    $.ajax({
                        type: "POST",
                        url: localStorage.getItem('serverurl'),
                        data: {
                            id: localStorage.getItem('iden'),
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            timestamp: position.timestamp,
                            altitude: position.coords.altitude,
                            speed: position.coords.speed,
                            bearing: '1',
                            accuracy: position.coords.accuracy
                        },
                        success: function(result) {
                            logshow('Success')
                        }
                    });
            }
            lastUpdateTime = now;
        }
    };

    function onError(error) {
        logshow(error.message)
    }
}

function stoptracking() {
	localStorage.setItem('latitude', '');
    localStorage.setItem('starttracking', 'false');
    cordova.plugins.backgroundMode.disable();
    document.getElementById('starttrackingblk').style.display = 'block';
    document.getElementById('stoptrackingblk').style.display = 'none';
    navigator.geolocation.clearWatch(localStorage.getItem('watchID'));
    $('#logdata').empty();
}

function clrlog() {
    $('#logmodel').modal('hide');
    $('#logdata').empty();

}

function showmodel() {
    $('#logmodel').appendTo("body").modal('show');
}

function identifiersave() {
    localStorage.setItem('iden', $('#iden').val());
    localStorage.setItem('serverurl', $('#serverurl').val());
    localStorage.setItem('freq', $('#freq').val());
    $("body").removeClass("sidemenu-open");
}

function logshow(message, time) {
    var d = new Date();          
    var n = d.toLocaleString([], { hour12: true}); 
    $("#logdata").append('<li class="list-group-item"><div class="row align-items-center"><div class="col align-self-center pr-0"><h6 class="font-weight-normal mb-1">' + message + '</h6><p class="text-mute small text-secondary">' + n + '</p></div></div></li>');
    if($('.list-group ul li').length > 10 ) {
      var list = $('.list-group li:lt(10)');
      list.hide();
    }  
}