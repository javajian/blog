$(function () {

    $("#category").select2();
    $("#tag").select2({
        tags:[""],
        tokenSeparators: [" "],
        maximumInputLength: 12,
        maximumSelectionSize:4
    });

	um = UM.getEditor('container', {
        /* 传入配置参数,可配参数列表看umeditor.config.js */
        imageUrl:'/upload',
        imagePath:'/'
    });

    if(!hasOl){
        $('#noLogin').removeClass('hide');
        disableForm();
    }else{
        enableForm();
    }
    // alert(um.getContent())
    $('#blog_add_login').on('click',function(){
    	loginHandler(function(){
    		// 执行登录
    		$('#noLogin').hide();
            enableForm();
    	});
    });

    $('#blog_add_reg').on('click',function(){
    	regHandler(function(){
    		// 执行注册
    		$('#noLogin').hide();
            enableForm();
    	});
    });

    $('#submitBtn').on('click',doSubmit)
    var umeditors = $('.edui-container');
    // resize umeditor change width
    $(window).on('resize',function(){
        umeditors.css('width',umeditors.parent().width()+'px');
    });
});

function doSubmit(){
    var params = $('#postForm').serialize();
    var content = UM.getEditor('container').getContentTxt();
    var tag = $("#tag").select2("val");
    $.ajax({
        url:'/blog/post',
        type:'post',
        data:params+'&contentText='+content+'&tag='+tag,
        success:function(res,textStatus,jqXHR){
            if(res.login === 'no'){
                // not logged 
                showTip({msg:i18n[lan].notLogin});
            }
        },
        error:function(xhr,textStatus,et){
            errorFun(xhr);
        }
    });
}

function disableForm(){
    $('#title').prop('disabled',true);
    UM.getEditor('container').setDisabled();
    $("#category").select2('disable',true);
    $("#tag").select2('disable',true);
    $('#submitBtn').prop('disabled',true);
}

function enableForm(){
    $('#title').prop('disabled',false);
    UM.getEditor('container').setEnabled();
    $("#category").select2('enable',true);
    $("#tag").select2('enable',true);
    $('#submitBtn').prop('disabled',false);
}