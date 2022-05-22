let map, infobox, currentPushpin;
//1．位置情報の取得に成功した時の処理
function mapsInit(position) {
    console.log(position,"成功した");
    //lat=緯度、lon=経度 を取得
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    map = new Microsoft.Maps.Map('#myMap', {
      center: new Microsoft.Maps.Location(lat, lon), //Location center position
      mapTypeId: Microsoft.Maps.MapTypeId.load, //Type: [load, aerial,canvasDark,canvasLight,birdseye,grayscale,streetside]
      zoom: 10  //Zoom:1=zoomOut, 20=zoomUp[ 1~20 ]
    });

    //Get MAP Information
    let center = map.getCenter();
    //Create custom Pushpin
    let pin = new Microsoft.Maps.Pushpin(center, {
        color: 'red',            //Color
        enableClickedStyle:true, //Click
        enableHoverStyle:true,   //MouseOver
        visible:true             //show/hide
    });
    //Add the pushpin to the map
    map.entities.push(pin);

    //Add a click event to the map.
    Microsoft.Maps.Events.addHandler(map, 'click', mapClicked);
    //Create an infobox, but hide it. We can reuse it for each pushpin.
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
    infobox.setMap(map);
};

//2． 位置情報の取得に失敗した場合の処理
function mapsError(error) {
  let e = "";
  if (error.code == 1) { //1＝位置情報取得が許可されてない（ブラウザの設定）
    e = "位置情報が許可されてません";
  }
  if (error.code == 2) { //2＝現在地を特定できない
    e = "現在位置を特定できません";
  }
  if (error.code == 3) { //3＝位置情報を取得する前にタイムアウトになった場合
    e = "位置情報を取得する前にタイムアウトになりました";
  }
  alert("エラー：" + e);
};

//3.位置情報取得オプション
const set ={
  enableHighAccuracy: true, //より高精度な位置を求める
  maximumAge: 20000,        //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
  timeout: 10000            //10秒以内に現在地情報を取得できなければ、処理を終了
};

function GetMap() {
    //Main:位置情報を取得する処理 //getCurrentPosition :or: watchPosition
    navigator.geolocation.getCurrentPosition(mapsInit, mapsError, set);
}

function mapClicked(e) {
    //Create a pushpin.
    currentPushpin = new Microsoft.Maps.Pushpin(e.location);
    //Add a click event to the pushpin.
    Microsoft.Maps.Events.addHandler(currentPushpin, 'click', pushpinClicked);
    //Add the pushpin to the map.
    map.entities.push(currentPushpin);
    //Open up an input form here the user can enter in details for pushpin.
    document.getElementById('inputForm').style.display = '';
}

function saveData() {
    //Get the data from form and add it to the pushpin
    currentPushpin.metadata = {
        title: document.getElementById('titleTbx').value,
        description: document.getElementById('descriptionTbx').value
    };
    //Optionally save this data somewhere (like a database or local storage).

    //Clear the fields in the form and then hide the form.
    document.getElementById('titleTbx').value = '';
    document.getElementById('descriptionTbx').value = '';
    document.getElementById('inputForm').style.display = 'none';
}

function pushpinClicked(e) {
    if (e.target.metadata) {
        infobox.setOptions({
            location: e.target.getLocation(),
            title: e.target.metadata.title,
            description: e.target.metadata.description,
            visible: true
        });
    }
}