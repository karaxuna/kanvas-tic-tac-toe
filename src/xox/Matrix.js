(function (ns) {
    
    function Matrix(width, height) {
        var self = this,
            values = self.values = {};
        
        self.width = width;
        self.height = height;
    };

    Matrix.prototype.iterate = function (callback) {
        var self = this,
            width = self.width,
            height = self.height,
            values = self.values;

        var i, j, br;
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                br = callback(i, j, values[i] ? values[i][j] : null) === false;
                if (br) {
                    break;
                }
            }
        }
    };

    Matrix.prototype.get = function (i, j) {
        var self = this;
        return self.values[i][j];
    };

    Matrix.prototype.set = function (i, j, value) {
        var self = this;
        self.values[i] = self.values[i] || {};
        self.values[i][j] = value;
    };

    ns.Matrix = Matrix;

})(window.xox = (window.xox || {}));