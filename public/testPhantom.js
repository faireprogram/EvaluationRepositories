var page = require('webpage').create();
page.viewportSize = {
    width: 1024,
    height: 768
};
page.open('http://localhost:8090/grasp/111', function(status) {
    console.log("Status: " + status);
    if (status === "success") {
        page.render('example.png');

    }
    phantom.exit();

});
