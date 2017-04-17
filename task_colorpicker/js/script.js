/**
 * Created by cycbot on 2017/4/17.
 */
window.onload = function(){
    setColors();
    setColorItemsEvent();
    showColor();
    setColorInput();
    setRGBorHSL();

}

function addEvent(element,event,listener){
    if(element.addEventListener){
        element.addEventListener(event,listener,false);
    }else if(element.attachEvent){
        element.attachEvent('on'+event,listener);
    }else{
        element['on'+event] = listener;
    }
}

var myData =  {
    canvas : document.getElementById('colors'),
    canvasColor : document.getElementById('color'),
    plus : document.getElementsByClassName('plusButton'),
    subtract : document.getElementsByClassName('subtractButton'),
    colorInput : document.getElementById('specialColor'),
    colorDiv : document.querySelector(".colorDiv"),
    red : document.getElementById('red'),
    green : document.getElementById('green'),
    blue : document.getElementById('blue'),

    hue : document.getElementById('hue'),
    saturation : document.getElementById('saturation'),
    lightness : document.getElementById('lightness'),
    x:0,
    y:0
};


function setColors(){
    var context = myData.canvas.getContext('2d');

    var width = myData.canvas.width = 20;
    var height = myData.canvas.height = 400;
    var linearGra = context.createLinearGradient(0,0,0,height);
    linearGra.addColorStop(0.0,'#FF3333');
    linearGra.addColorStop(0.2,'#F3FF33');
    linearGra.addColorStop(0.4,'#33FF33');
    linearGra.addColorStop(0.6,'#3333FF');
    linearGra.addColorStop(0.8,'#FF33F3');
    linearGra.addColorStop(1.0,'#FF3333');
    context.fillStyle = linearGra;
    context.fillRect(0,0,width,height);
    context.fill();
}

function setColorBlock(color,flag){
    var contextColor = myData.canvasColor.getContext('2d');
    var colorCanvas_width = myData.canvasColor.width = 400;
    var colorCanvas_height = myData.canvasColor.height = 400;
    var linearGraColor = contextColor.createLinearGradient(0,0,colorCanvas_width,colorCanvas_height);
    var selectColor = color || '#ff3333';
    contextColor.clearRect(0,0,colorCanvas_width,colorCanvas_height);
    linearGraColor.addColorStop(0.0,'#ffffff');
    linearGraColor.addColorStop(0.5,selectColor);
    linearGraColor.addColorStop(1.0,'#000000');
    if(flag){
        contextColor.fillStyle = linearGraColor;
    }else{
        contextColor.fillStyle = color;
    }

    contextColor.fillRect(0,0,colorCanvas_width,colorCanvas_height);
    contextColor.fill();
}


function setColorItemsEvent(){
    var context = myData.canvas.getContext('2d');
    var contextColor = myData.canvasColor.getContext('2d');

    var colorItems = document.querySelector('.colorItems');
    var redCircle = document.querySelector('.redCircle');
    var imageData,imageColor;
    var data,color,colorData;
    var HSL = [];
    color = '#ff3333';
    setColorBlock(color,true);
    addEvent(myData.canvas,'click',function(e){
        imageData = context.getImageData(e.offsetX,e.offsetY,1,1);
        data = imageData.data;
        color = '#'+data[0].toString(16)+data[1].toString(16)+data[2].toString(16);
        redCircle.style.top = Math.min(e.offsetY,392) + 'px';
        setColorBlock(color,true);
        imageColor = contextColor.getImageData(myData.x,myData.y,1,1);
        colorData = imageColor.data;
        myData.red.value = colorData[0];
        myData.green.value = colorData[1];
        myData.blue.value = colorData[2];
        HSL = rgbToHsl(colorData[0],colorData[1],colorData[2]);
        myData.hue.value = HSL[0].toFixed(2);
        myData.saturation.value = HSL[1].toFixed(2);
        myData.lightness.value = HSL[2].toFixed(2);
    });
}


function showColor(totalData){
    var canvasColor = document.getElementById('color');
    var contextColor = canvasColor.getContext('2d');

    var selectColor = document.querySelector('.selectColor');
    var imageData;
    var data,color;
    var HSL = [];
    addEvent(canvasColor,'click',function(e){
        myData.x = e.offsetX;
        myData.y = e.offsetY;
        imageData = contextColor.getImageData(e.offsetX,e.offsetY,1,1);
        data = imageData.data;
        myData.red.value = data[0];
        myData.green.value = data[1];
        myData.blue.value = data[2];
        color = '#'+data[0].toString(16)+data[1].toString(16)+data[2].toString(16);
        selectColor.style.top = Math.min(e.offsetY,395)-8 + 'px';
        selectColor.style.left = Math.min(e.offsetX,395)-8 + 'px';
        HSL = rgbToHsl(data[0],data[1],data[2]);
        myData.hue.value = HSL[0].toFixed(2);
        myData.saturation.value = HSL[1].toFixed(2);
        myData.lightness.value = HSL[2].toFixed(2);
        myData.colorDiv.style.backgroundColor = color;
        myData.colorInput.value = color;
    })
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function setRGBorHSL(){
    var colorInput = document.getElementsByClassName('colorInput');
    var color;
    for(var i = 0;i < myData.plus.length/2;i++){
        myData.plus[i].dataset.index = i;
        myData.subtract[i].dataset.index = i;
        addEvent(myData.plus[i],'click',function(){
            var temp = colorInput[this.dataset.index].value;
            var hsl = [];
            temp = (temp > 254?temp:++temp);
            colorInput[this.dataset.index].value = temp;
            hsl = rgbToHsl(parseInt(myData.red.value),parseInt(myData.green.value),parseInt(myData.blue.value));
            color = '#'+parseInt(myData.red.value).toString(16)+parseInt(myData.green.value).toString(16)+ parseInt(myData.blue.value).toString(16);
            setColorBlock(color,false);
            myData.hue.value = hsl[0].toFixed(2);
            myData.saturation.value = hsl[1].toFixed(2);
            myData.lightness.value = hsl[2].toFixed(2);

        })
        addEvent(myData.subtract[i],'click',function(){
            var temp = colorInput[this.dataset.index].value;
            var hsl = [];
            temp = (temp <= 0?temp:--temp);
            colorInput[this.dataset.index].value = temp;
            hsl = rgbToHsl(parseInt(myData.red.value),parseInt(myData.green.value),parseInt(myData.blue.value));
            myData.hue.value = hsl[0].toFixed(2);
            myData.saturation.value = hsl[1].toFixed(2);
            myData.lightness.value = hsl[2].toFixed(2);

            color = '#'+parseInt(myData.red.value).toString(16)+parseInt(myData.green.value).toString(16)+ parseInt(myData.blue.value).toString(16);
            setColorBlock(color,false);
        })
    }

    for(var j = myData.plus.length/2;i < myData.plus.length;j++){
        myData.plus[j].dataset.index = j;
        myData.subtract[j].dataset.index = j;
        addEvent(myData.plus[j],'click',function(){
            var temp = colorInput[this.dataset.index].value;
            var rgb = [];
            temp = (temp >= 1?temp:parseFloat(temp)+0.01);
            colorInput[this.dataset.index].value = temp.toFixed(2);
            rgb = hslToRgb(parseFloat(myData.hue.value),parseFloat(myData.saturation.value),parseFloat(myData.lightness.value));
            myData.red.value = rgb[0];
            myData.green.value = rgb[1];
            myData.blue.value = rgb[2];

            color = '#'+parseInt(myData.red.value).toString(16)+parseInt(myData.green.value).toString(16)+ parseInt(myData.blue.value).toString(16);
            setColorBlock(color,false);
        })
        addEvent(myData.subtract[j],'click',function(){
            var temp = colorInput[this.dataset.index].value;
            var rgb = [];
            temp = (temp <= 0?temp:parseFloat(temp)-0.01);
            colorInput[this.dataset.index].value = temp.toFixed(2);
            rgb = hslToRgb(parseFloat(myData.hue.value),parseFloat(myData.saturation.value),parseFloat(myData.lightness.value));
            myData.red.value = rgb[0];
            myData.green.value = rgb[1];
            myData.blue.value = rgb[2];

            color = '#'+parseInt(myData.red.value).toString(16)+parseInt(myData.green.value).toString(16)+ parseInt(myData.blue.value).toString(16);
            setColorBlock(color,false);
        })
    }
}

function setColorInput(){


    addEvent(myData.colorInput,'change',function(){
        var flag = myData.colorInput.value.match(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/);
        var hsl = [];
        if(flag){
            if(myData.colorInput.value.length == 4){
                myData.red.value = parseInt('0x'+(myData.colorInput.value[1]+myData.colorInput.value[1]));
                myData.green.value = parseInt('0x'+(myData.colorInput.value[2]+myData.colorInput.value[2]));
                myData.blue.value = parseInt('0x'+(myData.colorInput.value[3]+myData.colorInput.value[3]));
                hsl = rgbToHsl(parseInt(myData.red.value),parseInt(myData.green.value),parseInt(myData.blue.value));
                myData.hue.value = hsl[0].toFixed(2);
                myData.saturation.value = hsl[1].toFixed(2);
                myData.lightness.value = hsl[2].toFixed(2);
                myData.colorDiv.style.backgroundColor = myData.colorInput.value;
            }else{
                myData.red.value = parseInt('0x'+(myData.colorInput.value[1]+myData.colorInput.value[2]));
                myData.green.value = parseInt('0x'+(myData.colorInput.value[3]+myData.colorInput.value[4]));
                myData.blue.value = parseInt('0x'+(myData.colorInput.value[5]+myData.colorInput.value[6]));
                hsl = rgbToHsl(parseInt(myData.red.value),parseInt(myData.green.value),parseInt(myData.blue.value));
                myData.hue.value = hsl[0].toFixed(2);
                myData.saturation.value = hsl[1].toFixed(2);
                myData.lightness.value = hsl[2].toFixed(2);
                myData.colorDiv.style.backgroundColor = myData.colorInput.value;
            }
        }else{
            alert('输入的不是颜色值')
        }
    })

}
