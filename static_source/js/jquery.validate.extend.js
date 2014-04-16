(function() {
    $.validator.setDefaults({
        debug: true,
        errorElement: "em",
        errorPlacement: function(error, element) {
            element.myTooltip({content:error,firstShow:true});
            element.parents('.form-group').addClass('has-error');
        },
        success: function(label) {
            var element = $('#'+label.attr('for'));
            element.parents('.form-group').removeClass('has-error').addClass('has-success')
            element.myTooltip('close');
        },
    });

    function isIdCard(value){
    	// 15位不验证
    	// var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    	var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    	return isIDCard2.test(value);
    }

    jQuery.validator.addMethod("idCard", function(value, element, params) {   
		return this.optional(element) || isIdCard(value);   
	},"身份证格式错误!");

	jQuery.validator.addMethod("mobile", function(value, element, params) {
		return this.optional(element) || /^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(value);
	}, "手机号格式错误!");

	jQuery.validator.addMethod("postCode", function(value, element, params) {
		return this.optional(element) || /^[1-9]\d{5}$/.test(value);
	}, "邮政编码格式错误!");

}());