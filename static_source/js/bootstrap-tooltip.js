;(function($, undefined) {
	"use strict";

	var pluginName = 'myTooltip';

	function Tooltip($trigger, options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$trigger = this.$target = $trigger;
		this.leaveTimeout = null;
		this.$tooltip = $('<div class="tooltip right in" style="z-index:1060;"><div class="tooltip-inner">Tooltip!</div><div class="tooltip-arrow"></div></div>').appendTo(this.options.appendTo).hide();
		this.$tooltip.find('.tooltip-inner').html(this.options.content);
		// 自定义tooltip样式
		if (this.options.cssclass != '') {
			this.$tooltip.addClass(this.options.cssclass);
		}
		if (this.options.target !== undefined) {
			this.$target = $(this.options.target);
		}
		// 绑定tooltip内容体鼠标划过和划出事件及close事件
		if (this.options.hoverable) {
			var self = this;
			this.$tooltip.on('mouseenter.' + pluginName, $.proxy(this.do_mouseenter, self))
						 .on('mouseleave.' + pluginName, $.proxy(this.do_mouseleave, self))
						 .on('close.' + pluginName, $.proxy(this.hide, self));
		}
	}


	$.extend(Tooltip.prototype, {
		show: function(allowMirror) {
			if (allowMirror === undefined) {
				allowMirror = true;
			}
			if(this.$tooltip.css('display') == 'block') {
				return; // 已经显示的情况下,不要再重新显示了
			}
			this.$tooltip.removeClass('top top-left top-right right bottom bottom-left bottom-right left ').addClass(this.options.position);
			var  targetBox = this.$target.offset()
				,tooltipBox = {left: 0, top: 0, width: Math.floor(this.$tooltip.outerWidth()), height: Math.floor(this.$tooltip.outerHeight())}
				,arrowBox = {left: 0, top: 0, width: Math.floor(this.$tooltip.find('.tooltip-arrow').outerWidth()), height: Math.floor(this.$tooltip.find('.tooltip-arrow').outerHeight())}
				,docBox = {left: $(document).scrollLeft(), top: $(document).scrollTop(), width: $(window).width(), height: $(window).height()};

			targetBox.left = Math.floor(targetBox.left);
			targetBox.top = Math.floor(targetBox.top);
			targetBox.width = Math.floor(this.$target.outerWidth());
			targetBox.height = Math.floor(this.$target.outerHeight());

			if (this.options.position === 'left') {
				tooltipBox.left = targetBox.left - tooltipBox.width - arrowBox.width;
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				arrowBox.left = tooltipBox.width;
				arrowBox.top = Math.floor(targetBox.height / 2);
			} else if (this.options.position === 'right') {
				tooltipBox.left = targetBox.left + targetBox.width + arrowBox.width;
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				arrowBox.left = -arrowBox.width;
				arrowBox.top = Math.floor(tooltipBox.height / 2);
			} else if (this.options.position === 'top') {
				tooltipBox.left = targetBox.left - Math.floor((tooltipBox.width - targetBox.width) / 2);
				tooltipBox.top = targetBox.top - tooltipBox.height - arrowBox.height;
				arrowBox.left = Math.floor(tooltipBox.width / 2);
				arrowBox.top = tooltipBox.height;
			} else if (this.options.position === 'bottom') {
				tooltipBox.left = targetBox.left - Math.floor((tooltipBox.width - targetBox.width) / 2);
				tooltipBox.top = targetBox.top + targetBox.height + arrowBox.height;
				arrowBox.left = Math.floor(tooltipBox.width / 2);
				arrowBox.top = -arrowBox.height;
			} else if (this.options.position === 'top-left') {
				tooltipBox.left = targetBox.left - tooltipBox.width + arrowBox.width;	// +arrowBox.width because pointer is under
				tooltipBox.top = targetBox.top - tooltipBox.height - arrowBox.height;
				arrowBox.left = tooltipBox.width - arrowBox.width;
				arrowBox.top = tooltipBox.height;
			} else if (this.options.position === 'top-right') {
				tooltipBox.left = targetBox.left + targetBox.width - arrowBox.width;
				tooltipBox.top = targetBox.top - tooltipBox.height - arrowBox.height;
				arrowBox.left = 1;
				arrowBox.top = tooltipBox.height;
			} else if (this.options.position === 'bottom-right') {
				tooltipBox.left = targetBox.left + targetBox.width - arrowBox.width;
				tooltipBox.top = targetBox.top + targetBox.height + arrowBox.height;
				arrowBox.left = 1;
				arrowBox.top = -arrowBox.height;
			} else if (this.options.position === 'bottom-left') {
				tooltipBox.left = targetBox.left - tooltipBox.width + arrowBox.width;
				tooltipBox.top = targetBox.top + targetBox.height + arrowBox.height;
				arrowBox.left = tooltipBox.width - arrowBox.width;
				arrowBox.top = -arrowBox.height;
			} else if (this.options.position === 'center') {
				tooltipBox.left = targetBox.left + Math.floor((targetBox.width - tooltipBox.width) / 2);
				tooltipBox.top = targetBox.top + Math.floor((targetBox.height - tooltipBox.height) / 2);
				allowMirror = false;
				this.$tooltip.find('tooltip-arrow').hide();
			}

			// if the tooltip is out of bounds we first mirror its position
			if (allowMirror) {
				var  newpos = this.options.position
					,do_mirror = false;
				if (tooltipBox.left < docBox.left) {
					newpos = newpos.replace('left', 'right');
					do_mirror = true;
				} else if (tooltipBox.left + tooltipBox.width > docBox.left + docBox.width) {
					newpos = newpos.replace('right', 'left');
					do_mirror = true;
				}
				if (tooltipBox.top < docBox.top) {
					newpos = newpos.replace('top', 'bottom');
					do_mirror = true;
				} else if (tooltipBox.top + tooltipBox.height > docBox.top + docBox.height) {
					newpos = newpos.replace('bottom', 'top');
					do_mirror = true;
				}
				if (do_mirror) {
					this.options.position = newpos;
					this.show(false);
					return this;
				}
			}

			// if we're here, it's definitely after the mirroring or the position is center
			// this part is for slightly moving the tooltip if it's still out of bounds
			var pointer_left = null,
				pointer_top = null;
			if (tooltipBox.left < docBox.left) {
				pointer_left = tooltipBox.left - docBox.left - arrowBox.width / 2;
				tooltipBox.left = docBox.left;
			} else if (tooltipBox.left + tooltipBox.width > docBox.left + docBox.width) {
				pointer_left = tooltipBox.left - docBox.left - docBox.width + tooltipBox.width - arrowBox.width / 2;
				tooltipBox.left = docBox.left + docBox.width - tooltipBox.width;
			}
			if (tooltipBox.top < docBox.top) {
				pointer_top = tooltipBox.top - docBox.top - arrowBox.height / 2;
				tooltipBox.top = docBox.top;
			} else if (tooltipBox.top + tooltipBox.height > docBox.top + docBox.height) {
				pointer_top = tooltipBox.top - docBox.top - docBox.height + tooltipBox.height - arrowBox.height / 2;
				tooltipBox.top = docBox.top + docBox.height - tooltipBox.height;
			}

			this.$tooltip.css({left: tooltipBox.left, top: tooltipBox.top});
			if (pointer_left !== null) {
				this.$tooltip.find('.tooltip-arrow').css('margin-left', pointer_left);
			}
			if (pointer_top !== null) {
				this.$tooltip.find('.tooltip-arrow').css('margin-top', '+=' + pointer_top);
			}

			this.$trigger.removeAttr('title');
			this.$tooltip.show();
			return this;
		}

		,hide: function() {
			if (this.$trigger.data('originalTitle')) {
				this.$trigger.attr('title', this.$trigger.data('originalTitle'));
			}
			if (typeof this.options.on_close == 'function') {
				this.options.on_close.call(this);
			}
			this.$tooltip.hide();
		}

		,do_mouseenter: function() {
			if (this.leaveTimeout !== null) {
				clearTimeout(this.leaveTimeout);
				this.leaveTimeout = null;
			}
			this.show();
		}

		,do_mouseleave: function() {
			var self = this;
			if (this.leaveTimeout !== null) {
				clearTimeout(this.leaveTimeout);
				this.leaveTimeout = null;
			}
			if (this.options.autoclose) {
				this.leaveTimeout = setTimeout(function() {
					clearTimeout(self.leaveTimeout);
					self.leaveTimeout = null;
					self.hide();
				}, this.options.delay);
			}
		}
	});

	$.fn[pluginName] = function(options) {
		var  method = null
			,first_run = false
			;
		if (typeof options == 'string') {
			method = options;
		}
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var  $this = $(this)
					,data = $this.data()
					,opts
					;
				first_run = true;
				if (typeof options === 'object') {
					opts = $.extend({}, options, data);
				} else {
					opts = data;
				}
				obj = new Tooltip($this, opts);
				$.data(this, pluginName, obj);
			}
			if (method) {
				obj[method]();
			} else if (first_run) {
				$(this).on('mouseenter.' + pluginName, function() {
					obj.do_mouseenter();
				}).on('mouseleave.' + pluginName, function() {
					obj.do_mouseleave();
				});
			} else {
				obj.show();
			}
		});
	};


	$[pluginName] = function(elem, options) {
		if (typeof elem === 'string') {
			elem = $(elem);
		}
		return new Tooltip(elem, options);
	};


	$.fn[pluginName].defaults = {
		 contentElem: null
		,contentAttr: null
		,content: ''
		,hoverable: true		// 鼠标是否可以划到tooltip上,bs默认是没有的
		,delay: 200
		,cssclass: ''
		,position: 'right'			// top,bottom,right,left,top-right.. 等等的组合
		,autoclose: true
		,appendTo: 'body'	// where should the tooltips be appended to (default to document.body). Added for unit tests, not really needed in real life.
	};
})(jQuery);
