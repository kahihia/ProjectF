var onDeviceReady = function() {
  var canvas2ImagePlugin = window.plugins.canvas2ImagePlugin;
  document.addEventListener("jpush.receiveRegistrationId", function (event) {
   console.log(event)
  }, false);

  initiateUI();
  getCurrent();
};

var getRegistrationID = function() {
  window.JPush.getRegistrationID(onGetRegistrationID);
};

var onGetRegistrationID = function(data) {
  try {
    var JPushData = {registrationID:data};
    console.log("JPushPlugin:registrationID is " + data);
    if (data.length == 0) {
      var t1 = window.setTimeout(getRegistrationID, 1000);
    }
    localStorage.setItem('JPushData',JSON.stringify(JPushData));
  } catch (exception) {
    console.log(exception);
  }
};

var onTagsWithAlias = function(event) {
  try {
    console.log("onTagsWithAlias");
    var result = "result code:" + event.resultCode + " ";
    result += "tags:" + event.tags + " ";
    result += "alias:" + event.alias + " ";
  } catch (exception) {
    console.log(exception)
  }
};

var onOpenNotification = function(event) {
  try {
    var alertContent;
    if (device.platform == "Android") {
      alertContent = event.alert;
    } else {
      alertContent = event.aps.alert;
    }
    alert("open Notification:" + alertContent);
  } catch (exception) {
    console.log("JPushPlugin:onOpenNotification" + exception);
  }
};

var onReceiveNotification = function(event) {
  try {
    var alertContent;
    if (device.platform == "Android") {
      alertContent = event.alert;
    } else {
      alertContent = event.aps.alert;
    }
  } catch (exception) {
    console.log(exception)
  }
};

var onReceiveMessage = function(event) {
  try {
    var message;
    if (device.platform == "Android") {
      message = event.message;
    } else {
      message = event.content;
    }
  } catch (exception) {
    console.log("JPushPlugin:onReceiveMessage-->" + exception);
  }
};

var initiateUI = function() {
  try {
    window.JPush.init();
    window.JPush.setDebugMode(true);
    window.setTimeout(getRegistrationID, 1000);
    if (device.platform != "Android") {
      window.JPush.resetBadge();
      window.JPush.setApplicationIconBadgeNumber(0);
    }
  } catch (exception) {
    console.log(exception);
  }
};
var getCurrent = function(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      //onSuccees
      // alert("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
      var positionData = {
        position:{
          lng:position.coords.longitude,
          lat:position.coords.latitude
        }
      };
      localStorage.setItem('position',JSON.stringify(positionData));
    } ,function(){
      //onError
      // alert("error!");
    } ,{ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  }else{
    alert("该浏览器不支持获取地理位置。")
  }
};
// where myCanvasId == 'myCanvas' (the id of the canvas above)
function mySavingFunction(myCanvasId) {
  canvas2ImagePlugin.saveImageDataToLibrary(
    function(msg){
      alert(msg);
      alert("Saving image is successful!");
    },
    function(err){
      alert(err);
    },
    myCanvasId
  );
}
document.addEventListener("deviceready", onDeviceReady, false);
// document.addEventListener("jpush.openNotification", onOpenNotification, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
