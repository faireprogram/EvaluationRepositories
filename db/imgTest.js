var fs = require('fs');
var gm = require('gm');
var util = require('../util/util.js');

// im.resize({
//   srcData: fs.readFileSync('./public/resource/avatar.png', 'binary'),
//   width:   256
// }, function(err, stdout, stderr){
//   if (err) throw err
//   fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
//   console.log('resized kittens.jpg to fit within 256x256px')
// });


gm(util.constant.DEFAULT_PROFILE_IMG.data)
.resize('100', '100')
.toBuffer('png', function(err, buffer) {
	console.log(buffer);
});