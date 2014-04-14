;(function($, undefined) {
	"use strict";

	var pluginName = 'myDialog';

	function Modal(options) {
		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		this.$modal = $(this.options.target).attr('class', 'modal fade').hide();
	}

	$.extend(Modal.prototype, {
		show: function() {
			var self = this
				,$backdrop;

			if (this.options.lock) {
				$backdrop = $('.modal-backdrop');
			}

		 	if (!this.$modal.length) {
				this.$modal = $('<div style="overflow:auto;" class="modal fade" id="' + this.options.target.substr(1) + '"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="padding:10px 16px;"><button type="button" class="close">&times;</button><h5 class="modal-title"></h5></div><div class="modal-body">...</div></div></div></div>').appendTo(this.options.appendTo).hide();
			}

			var modalDalog = this.$modal.find('.modal-dialog');

			if(this.options.title !== undefined){
				modalDalog.find('.modal-title').html(this.options.title);
			}
			
			if (this.options.cssclass !== undefined) {
				modalDalog.attr('class', 'modal fade ' + this.options.cssclass);
			}

			if (this.options.width !== undefined) {
				modalDalog.width(this.options.width);
			}
			// if (this.options.height !== undefined) {
			// 	modalDalog.height(this.options.height);
			// }
			

			if (this.options.keyboard) {
				this.escape();
			}

			if (this.options.lock) {
				if (!$backdrop.length) {
					$backdrop = $('<div class="modal-backdrop" />').appendTo(this.options.appendTo);
				}
				$backdrop[0].offsetWidth; // force reflow
				$backdrop.addClass('in');
			}

			if (this.options.remote !== undefined && this.options.remote != '' && this.options.remote !== '#') {
				var spinner;
				if (typeof Spinner == 'function') {
					spinner = new Spinner({color: '#3d9bce'}).spin(this.$modal[0]);
				}
				this.$modal.find('.modal-body').load(this.options.remote, function() {
					if (spinner) {
						spinner.stop();
					}
					if (self.options.cache) {
						self.options.content = $(this).html();
						delete self.options.remote;
					}
				});
			} else {
				modalDalog.find('.modal-body').html(this.options.content);
			}

			// modal 对话框填充
			if(this.options.btns){
				if(this.options.btns instanceof Array){
					if(this.options.btns.length > 0){
						var footer = '<div class="modal-footer" style="margin:0;padding:5px 15px'+(this.options.btnsPos?(';text-align:'+this.options.btnsPos):';')+'">';
						for(var i=0;i<this.options.btns.length;i++){
							var o = this.options.btns[i];
							footer += '<a href="javascript:;" style="padding:3px 10px;" class="btn btn-small'+(o.pk?' btn-info':' btn-default')+'">'+o.text+'</a>';
						}
						footer += '<div>';
						modalDalog.find('.modal-body').after(footer);
						modalDalog.find('.modal-footer > a').each(function(i,item){
							var that = $(item), txt = that.text();
							for(var i=0;i<self.options.btns.length;i++){
								var o = self.options.btns[i];
								if(txt == o.text){
									if(o.close && o.close === true){
										that.on('click',function(){self.close();});
									}else{
										var callback = undefined;
										if(o.handler !== undefined && typeof o.handler === 'function'){
											callback = o.handler;
											that.on('click', function(){callback(self,modalDalog);});
										}
									}
								}
							}
						});
					}
				}
			}

			// 注册关闭事件
			this.$modal.find('.close').off('click.' + pluginName).on('click.' + pluginName, function() {
				self.close.call(self);
			});
			// 拖拽
			if(this.options.dd !== undefined && this.options.dd === true){
				modalDalog.draggable({handle:'.modal-header',containment:'parent',cursor: "move"});
			}

			this.$modal.show().addClass('in');
			// 显示在最中间
			modalDalog.css({margin:0,left:($(window).width() - modalDalog.outerWidth())/2+'px',
				top:($(window).height()-modalDalog.height())/2 +'px'});

			if (this.options.left !== undefined) {
				modalDalog.css({'left': this.options.left});
			}
			if (this.options.top !== undefined) {
				modalDalog.css({'top': this.options.top});
			}
			return this;
		}

		,setTitle:function(title){
			this.$modal.find('.modal-title').html(title);
		}

		,getTitle:function(){
			return this.$modal.find('.modal-title').html();
		}

		,setContent:function(content){
			this.$modal.find('.modal-body').html(content);
		}

		,close: function() {
			this.$modal.hide().off('.' + pluginName);
			if (this.options.cssclass !== undefined) {
				this.$modal.removeClass(this.options.cssclass);
			}
			$(document).off('keyup.' + pluginName);
			this.$modal.remove();
			$('.modal-backdrop').remove();
			if (typeof this.options.onClose === 'function') {
				this.options.onClose.call(this, this.options);
			}
			return this;
		}

		,destroy: function() {
			this.$modal.remove();
			$(document).off('keyup.' + pluginName);
			$('.modal-backdrop').remove();
			this.$modal = null;
			return this;
		}

		,escape: function() {
			var self = this;
			$(document).on('keyup.' + pluginName, function(e) {
				if (e.which == 27) {
					self.close();
				}
			});
		}
	});


	$.fn[pluginName] = function(options) {
		return this.each(function() {
			var obj;
			if (!(obj = $.data(this, pluginName))) {
				var  $this = $(this)
					,data = $this.data()
					,opts = $.extend({}, options, data)
					;
				if ($this.attr('href') !== '' && $this.attr('href') != '#') {
					opts.remote = $this.attr('href');
				}
				obj = new Modal(opts);
				$.data(this, pluginName, obj);
			}
			obj.show();
		});
	};


	$[pluginName] = function(options) {
		return new Modal(options);
	};

	$.fn[pluginName].defaults = {
		title: '提示'		// modal title
		,target: '#myDialog'	// the modal id. MUST be an id for now.
		,content: ''		// the static modal content (in case it's not loaded via ajax)
		,appendTo: 'body'	// where should the modal be appended to (default to document.body). Added for unit tests, not really needed in real life.
		,cache: false		// should we cache the output of the ajax calls so that next time they're shown from cache?
		,keyboard: true
		,btnsPos:'right'
		,lock: false
		,onClose:null
		,dd:false
	};
})(jQuery);