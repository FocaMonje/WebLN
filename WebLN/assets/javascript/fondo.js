var backgroundSketch = function (p) {
    var window_size = Math.sqrt(Math.pow(p.windowWidth, 2) + Math.pow(p.windowHeight, 2));
    var max_connection_distance = window_size / 3.75;
    var dot_colors = ['#008080', '#ADD8E6', '#61B2CB', '#2EA2D1'];
    var max_dots = 40;
    var min_dots = 15;
    var max_size = 15;
    var min_size = 4;
    var max_velocity = Math.random() * 5;
    var max_delta_direction = 3;
    var threshold = 0 * max_connection_distance;
    var inverse_threshold = max_connection_distance - threshold;
  
    p.setup = function () {
      var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      canvas.position(0, 0);
      canvas.style('z-index', '-1');
      canvas.style('position', 'fixed');
      dots.init();
    };
  
    p.draw = function () {
      p.background(10);
      dots.connect();
      dots.update();
      dots.show();
    };
  
    var dots = {
      num_dots: 0,
      dot_list: [],
      init: function () {
        this.num_dots = Math.floor(Math.random() * (max_dots - min_dots) + min_dots);
        for (var i = 0; i < this.num_dots; i++) {
          var rand_x = Math.random() * p.windowWidth;
          var rand_y = Math.random() * p.windowHeight;
          var rand_size = Math.random() * (max_size - min_size) + min_size;
          var rand_velocity = Math.random() * max_velocity;
          this.dot_list.push(new Dot(rand_x, rand_y, rand_size, rand_velocity));
        }
      },
      update: function () {
        for (var i in this.dot_list) {
          var dot = this.dot_list[i];
          dot.update();
        }
      },
      show: function () {
        for (var i in this.dot_list) {
          var dot = this.dot_list[i];
          dot.show();
        }
      },
      connect: function () {
        for (var i = 0; i < this.dot_list.length; i++) {
          var dot = this.dot_list[i];
          for (var j = i + 1; j < this.dot_list.length; j++) {
            var compare = this.dot_list[j];
            var distance = get_distance(compare, dot);
            if (distance < max_connection_distance) {
              if (dot.neighbors.indexOf(compare) == -1) {
                dot.neighbors.push(compare);
              }
            }
          }
        }
      }
    };
  
    function Dot(x, y, size, velocity) {
      this.neighbors = [];
      this.direction = Math.random() * 360;
      this.pos = p.createVector(x, y);
      this.size = size;
      this.velocity = velocity;
      this.color = dot_colors[Math.floor(Math.random() * dot_colors.length)];
      this.line_color = dot_colors[Math.floor(Math.random() * dot_colors.length)];
      this.adjust = (Math.random() * max_delta_direction * 2) - max_delta_direction;
  
      this.show = function () {
        for (var i in this.neighbors) {
          var neighbor = this.neighbors[i];
          var distance = get_distance(this, neighbor);
          if (distance < max_connection_distance) {
            var overflow = distance - threshold;
            var opacity = 255 - (overflow / inverse_threshold) * 255;
            var rgb = hexToRgb(this.line_color);
            p.stroke(rgb['r'], rgb['g'], rgb['b'], opacity);
            p.line(this.pos.x, this.pos.y, neighbor.pos.x, neighbor.pos.y);
          } else {
            this.neighbors.splice(i, 1);
          }
        }
        p.fill(this.color);
        p.noStroke();
        p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
      };
  
      this.update = function () {
        if (Math.floor(Math.random() * 20) == 0) {
          this.adjust = (Math.random() * max_delta_direction * 2) - max_delta_direction;
        }
  
        this.direction = (this.adjust + this.direction);
        var rads = (this.direction * Math.PI) / 180;
        var new_x = Math.cos(rads) * this.velocity + this.pos.x;
        if (new_x >= p.windowWidth || new_x <= 0) {
          new_x = this.pos.x;
          this.direction = Math.random() * 360;
        }
        var new_y = Math.sin(rads) * this.velocity + this.pos.y;
        if (new_y >= p.windowHeight || new_y <= 0) {
          new_y = this.pos.y;
          this.direction = Math.random() * 360;
        }
        this.pos = p.createVector(new_x, new_y);
      };
    }
  
    function get_distance(dot1, dot2) {
      var dx = dot2.pos.x - dot1.pos.x;
      var dy = dot2.pos.y - dot1.pos.y;
      return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
  
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  
    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};
  
new p5(backgroundSketch);
  