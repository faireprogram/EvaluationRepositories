(function(global) {

    'use strict';
    var main_module = global.main_module;

    var readAndPreview = function(file, preview) {

        // Make sure `file.name` matches our extensions criteria
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();

            reader.addEventListener("load", function() {
                var img = $('img', preview)[0];
                img.src = this.result;
            }, false);

            reader.readAsDataURL(file);
        }
    };

    main_module.directive('fileModel', ['$parse',
        function($parse) {
            return {
                restrict: 'A',
                template: '<div class="preview-group">' +
                    '<img ng-src="/api/profileImg/{{user.pid | randomFilter:\'?token=\'}}">' +
                    '</div>' +
                    '<div class="input-group">' +
                    '<span class="input-group-btn">' +
                    '<span class="btn btn-primary btn-file">' +
                    'Browse&hellip; <input type="file">' +
                    '</span>' +
                    '</span>' +
                    '<input type="text" class="form-control" readonly>' +
                    '</div>',

                link: function(scope, element, attrs) {
                    // if (scope.promise) {
                    //     scope.promise.then(function(data) {
                    //         var model = $parse(attrs.fileModel);
                    //         var modelSetter = model.assign;

                    //         $('.btn-file :file', element).on('change', function() {
                    //             var input = $(this);
                    //             var numFiles = input.get(0).files ? input.get(0).files.length : 1;
                    //             var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                    //             input.trigger('fileselect', [numFiles, label]);

                    //         });

                    //         $('.btn-file :file', element).on('fileselect', function(eve, nums, label) {
                    //             var input = $(this).parents('.input-group').find(':text');
                    //             // change the url path of input
                    //             input.val(label);

                    //             // change the preview
                    //             var preview = $(this).parents('.input-group').prev();
                    //             var files = this.files;
                    //             if (files) {
                    //                 readAndPreview(files[0], preview[0]);
                    //             };

                    //             scope.$apply(function() {
                    //                 modelSetter(scope, files[0]);
                    //             });
                    //         });
                    //     });
                    // }


                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    $('.btn-file :file', element).on('change', function() {
                        var input = $(this);
                        var numFiles = input.get(0).files ? input.get(0).files.length : 1;
                        var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
                        input.trigger('fileselect', [numFiles, label]);

                    });

                    $('.btn-file :file', element).on('fileselect', function(eve, nums, label) {
                        var input = $(this).parents('.input-group').find(':text');
                        // change the url path of input
                        input.val(label);

                        // change the preview
                        var preview = $(this).parents('.input-group').prev();
                        var files = this.files;
                        if (files) {
                            readAndPreview(files[0], preview[0]);
                        };

                        scope.$apply(function() {
                            modelSetter(scope, files[0]);
                        });
                    });

                    // element.bind('change', function() {
                    //     scope.$apply(function() {
                    //         modelSetter(scope, element[0].files[0]);
                    //     });
                    // });
                }
            };
        }
    ]);
})(this);