var xlsx = require("node-xlsx");
var fs = require('fs')
var list = xlsx.parse(__dirname + '/test1.xls');
var data = list[0].data

var json = []

/*
var china = {
	"省":{
		"市":{
			"1区": 123,
			"2区": 234
		}
	}
}*/
var obj = {}
data.forEach(function(item) {

    if ((function() {
            var flag = true
            item.forEach(function(item) {
                if (item == "" || item.length < 3) flag = false
            })
            return flag
        })()) {
        if (!obj[item[0]]) {
            obj[item[0]] = {}
        }
        if (!obj[item[0]][item[1]]) {
            obj[item[0]][item[1]] = {}
        }
        if (!obj[item[0]][item[1]][item[2]]) {
            obj[item[0]][item[1]][item[2]] = item[3]
        }
    }
});
//数据合并处理

var result = []
for (var x in obj) {
    result.push({
        name: x, //province
        sub: (function() {
            var arr = []
            for (var y in obj[x]) {
                if (x == y) { //municipality handler
                    for (var z in obj[x][y]) {
                        arr.push({
                            name: z, //county
                            value: obj[x][y][z]
                        })
                    }
                    return arr
                }
                arr.push({ //not municipality handler
                    name: y, //city
                    sub: (function() {
                        var arr = []
                        for (var z in obj[x][y]) {
                            arr.push({
                                name: z, //county
                                value: obj[x][y][z]
                            })
                        }
                        return arr
                    })()
                })
            }
            return arr
        })()
    })

}
fs.writeFile('./test.json', JSON.stringify(result))