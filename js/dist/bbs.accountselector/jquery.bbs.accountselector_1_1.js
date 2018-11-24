/*
 * Project: BBS.AccountSelector
 * Version: 1.1
 * Author: dnn.site
 * Website: http://dnnsite.ru
*/
(function ($) {
    var defaults = {
        localzRes: {                        
             anonymousPersonFldDisplayNameTitle:'Display Name'
            ,anonymousPersonFldEmailTitle:'Email'
            ,anonymousPersonFldPhoneTitle:'Phone'
            ,organizationTabText:'Organization'
            ,organizationFldSelectorTitle:'Organization'
            ,organizationFldContactSelectorTitle:'Contacts'            
            ,organizationFldSelectorPlaceholderText:'Select organization...'
            ,organizationFldContactSelectorPlaceholderText:'Select contacts...'
            ,personTabTitle:'Person'
            ,personFldSelectorPlaceholderText:'Select contacts...'
            ,personFldSelectorTitle:'User'
            ,accountFldSelectorTitle:'Account'
            ,defVal:null
        }
            ,modId:''                        
            ,listSrcUrl:''
            ,organizationAccListSrcName:''
            ,personAccListSrcName:''
            ,personListSrcName:''
            ,mixListSrcName:''
            ,filterListByTypeAcc:null
            ,filterListByUserPermission:null                        
            ,viewMode:'light'
            ,organizationSelectEnable:true
            ,personSelectEnable:true
            ,anonymousPersonSelectEnable:false
            ,defaultActive:'person'
            ,minimumResultsForSearch:10                    
		,onChange:function(){}
    },settings,
    methods={
        init:function(options){
            settings=$.extend({},defaults,options);
            return this.each(function(){
                paneId=$(this).attr('id');
                if(settings.viewMode=='full'){initWidget_fullMode();}else{initWidget_lightMode();}
            });
        }
        ,getValue:function(isRaw){return getValue(isRaw);}
        ,clearValue:function(){clearFile();}
    };
    $.fn.bbsAccountSelector = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+methodOrOptions+' does not exist on jQuery.bbsAccountSelector');
        }
    }
    var paneId
    ,initWidget_lightMode=function(){
        var html='',pObj=$('#'+paneId),defVal=settings.defVal,defVal_accGuid='';
        //html+='<section>';
        //html+='<label class="label">'+settings.localzRes.accountFldSelectorTitle+'</label>';
        //html+='<label class="select select2-single-autoheight">';
        html+='<select id="frmAccountGUID'+settings.modId+'" name="frmAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
        //html+='</label>';
        //html+='</section>';
        pObj.replaceWith(html);
        /*$('#frmAccountGUID'+settings.modId).select2({
            theme:'bootstrap'
            ,hideSelectionFromResult:hideSelection
            ,escapeMarkup:function(text){return text;}
            ,minimumResultsForSearch:settings.minimumResultsForSearch
            ,placeholder:settings.localzRes.accountFldSelectorPlaceholderText
            ,templateResult:getMixResultTemp
            ,templateSelection:getMixSelectionTemp 
        });*/

        loadAccountList();
        $('#frmAccountGUID'+settings.modId).on('change',function(){
            /*var c=settings.dealerInfoBoxTemlate,d=$(this).find(':selected').data('meta'),did;
            if (d!=null&&typeof d=='object'){did=d.id;}
            $(this).data('val',$(this).val());*/
            settings.onChange.call(this);           

        });
    }    
    ,initWidget_fullMode=function(){
        var html='',pObj=$('#'+paneId),tabActive=settings.defaultActive,defVal=settings.defVal,defVal_accGuid='',defVal_contactUsers='',defVal_anmsPersonDisplayName='',defVal_anmsPersonEmail='',defVal_anmsPersonPhone='';
        if(defVal!=null&&typeof defVal=='object'){
            if(defVal.type=='organization'){
                defVal_accGuid=defVal.accid;
                defVal_contactUsers=JSON.stringify(defVal.contacts);
            }else if(defVal.type=='user'){
                defVal_accGuid=defVal.accid;
            }else if(defVal.type=='anonymous'){
                defVal_anmsPersonDisplayName=defVal.anonymousMeta.displayname;
                defVal_anmsPersonEmail=defVal.anonymousMeta.email;
                defVal_anmsPersonPhone=defVal.anonymousMeta.phone;
            }
        }
        if(tabActive=='organization'&&(settings.organizationSelectEnable==false||settings.anonymousPersonSelectEnable==true)){tabActive='person';}
        if(tabActive=='person'&&settings.personSelectEnable==false&&settings.anonymousPersonSelectEnable==false){tabActive='organization';}
        if(settings.organizationSelectEnable==true||settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){
            html+='<div id="navAccountPane'+settings.modId+'" class="tab-container tab-default bbs-accountselector">';
            html+='<ul id="navAccountTabPane'+settings.modId+'" class="nav nav-tabs">';
            html+='<li class="dropdown pull-right tabdrop hide"><a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-angle-down"></i></a><ul class="dropdown-menu"></ul></li>';
            if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){html+='<li'+(tabActive=='organization'?' class="active"':'')+'><a href="#navAccountDealerTab'+settings.modId+'" data-toggle="tab"><i class="fa fa-building"></i> '+settings.localzRes.organizationTabText+'</a></li>';}
            if(settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){html+='<li'+(tabActive=='person'?' class="active"':'')+'><a href="#navAccountUserTab'+settings.modId+'" data-toggle="tab"><i class="fa fa-user"></i> '+settings.localzRes.personTabTitle+'</a></li>';}                        
            html+='</ul>';
            html+='<div class="tab-content">';
            if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){                
                html+='<div class="sky-form tab-pane'+(tabActive=='organization'?' active':'')+'" id="navAccountDealerTab'+settings.modId+'">';                        
                html+='<fieldset>';                
                html+='<div class="row">';
                html+='<div class="col-md-6">';
                html+='<section>';
                html+='<label class="label">'+settings.localzRes.organizationFldSelectorTitle+'</label>';
                html+='<label class="select select2-single-autoheight">';
                html+='<select id="frmDealerAccountGUID'+settings.modId+'" name="frmDealerAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
                html+='</label>';
                html+='</section>';
                html+='</div>';
                html+='<div class="col-md-6">';
                html+='<section>';
                html+='<label class="label">'+settings.localzRes.organizationFldContactSelectorTitle+'</label>';
                html+='<label class="select">';
                html+='<select id="frmDealerContactUsers'+settings.modId+'" name="frmDealerContactUsers'+settings.modId+'" class="form-control select2-multiple" multiple disabled="disabled" data-val=\''+defVal_contactUsers+'\'></select>';
                html+='</label>';
                html+='</section>'
                html+='</div>';
                html+='</div>';                
                /*<div class=\"alert alert-info\"><i class=\"fa fa-info\"></i>&nbsp; <strong>Информация!</strong> Нет дилера, от имени которого Вы можете публиковать объявления.<br /><br /><a href=\"/my-office/dealers/UserId/[UserId,System]\" class=\"btn btn-info\" style=\"color:#fff!important;\">Зарегистрировать нового дилера</a></div>*/        
                html+='</fieldset>';
                html+='</div>';                
            }
            if(settings.personSelectEnable==true||settings.anonymousPersonSelectEnable==true){            
                html+='<div class="sky-form tab-pane'+(tabActive=='person'?' active':'')+'" id="navAccountUserTab'+settings.modId+'">';
                html+='<fieldset>';                
                html+='<div class="row">';
                if(settings.anonymousPersonSelectEnable==false){                    
                    html+='<div class="col-md-6">';
                    html+='<section>'        
                    html+='<label class="label">'+settings.localzRes.personFldSelectorTitle+'</label>';
                    html+='<label class="select select2-single-autoheight">';
                    html+='<select id="frmUserAccountGUID'+settings.modId+'" name="frmUserAccountGUID'+settings.modId+'" class="form-control select2-single" data-val="'+defVal_accGuid+'"></select>';
                    html+='</label>';
                    html+='</section>';
                    html+='</div>';
                    html+='<div class="col-md-6">';
                    html+='</div>';                    
                }else{                    
                    html+='<div class="col-md-6">';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldDisplayNameTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmDisplayName'+settings.modId+'" id="frmDisplayName'+settings.modId+'" type="text" maxlength="80"'+(defVal_anmsPersonDisplayName!=''?' value="'+defVal_anmsPersonDisplayName+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldEmailTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmEmail'+settings.modId+'" id="frmEmail'+settings.modId+'" type="text" maxlength="120" '+(defVal_anmsPersonEmail!=''?' value="'+defVal_anmsPersonEmail+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='<section>';
                    html+='<label class="label">'+settings.localzRes.anonymousPersonFldPhoneTitle+'</label>';
                    html+='<label class="input">';
                    html+='<input name="frmPhone'+settings.modId+'" id="frmPhone'+settings.modId+'" type="text" maxlength="20"'+(defVal_anmsPersonPhone!=''?' value="'+defVal_anmsPersonPhone+'"':'')+'>';
                    html+='</label>';
                    html+='</section>';
                    html+='</div>';
                    html+='<div class="col-md-6">';
                    html+='</div>';
                }
                html+='</div>';
                html+='</fieldset>';                                                
                html+='</div>';                
            }
            html+='</div>';
        }
        pObj.replaceWith(html);
        
        if(settings.organizationSelectEnable==true&&settings.anonymousPersonSelectEnable==false){
            $('#frmDealerAccountGUID'+settings.modId).select2({
                theme:'bootstrap'
                ,hideSelectionFromResult:hideSelection
                ,escapeMarkup:function(text){return text;}
                ,minimumResultsForSearch:settings.minimumResultsForSearch
                ,placeholder:settings.localzRes.organizationFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp 
            });        
            $('#frmDealerContactUsers'+settings.modId).select2({
                theme:'bootstrap'
                ,allowClear:false
                ,hideSelectionFromResult:hideSelection
                ,escapeMarkup:function(text){return text;}                
                ,placeholder:settings.localzRes.personFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp   
            });
            loadAccountList();
            $('#frmDealerAccountGUID'+settings.modId).on('change',function(){
                var c=settings.dealerInfoBoxTemlate,d=$(this).find(':selected').data('meta'),did;
                if (d!=null&&typeof d=='object'){did=d.id;}
                $(this).data('val',$(this).val());
                $('#frmDealerContactUsers'+settings.modId).data('val','');
                $('#frmDealerContactUsers'+settings.modId).val('').trigger('change');           
                loadOrganizationUserList(did);           
            });
            $('#frmDealerContactUsers'+settings.modId).on('change',function(){           
                $(this).data('val',$(this).val());                      
            });                                            
        }
        if(settings.personSelectEnable==true&&settings.anonymousPersonSelectEnable==false){
            $('#frmUserAccountGUID'+settings.modId).select2({
                theme:'bootstrap'            
                ,escapeMarkup:function(text){return text;}
                ,minimumResultsForSearch:settings.minimumResultsForSearch
                ,placeholder:settings.localzRes.personFldSelectorPlaceholderText
                ,templateResult:getMixResultTemp
                ,templateSelection:getMixSelectionTemp 
            });        
            loadFriendList();
        }
    },
    loadAccountList=function(m){
        var o='',f='',dVal='',isSel=false,srcname='';
        if(m=='organization'){o='#frmDealerAccountGUID'+settings.modId;srcname=settings.organizationAccListSrcName;}
        else if(m=='person'){o='#frmUserAccountGUID'+settings.modId;srcname=settings.personAccListSrcName;}
        else {o='#frmAccountGUID'+settings.modId;srcname=settings.mixListSrcName;}
        f={"srcname":srcname,"dlrtp":settings.filterListByTypeAcc};dVal=$(o).data('val');        
        $(o).html('');$(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    if(item.id==dVal&&isSel==false){isSel=true;}                    
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        }); 
        if(settings.viewMode=='full' && isSel==true){loadOrganizationUserList(dVal);}       
    },
    /*loadOrganizationList=function(){        
        var o='#frmDealerAccountGUID'+settings.modId;$(o).html(''),f={"srcname":"D854896F-B5C2-4A9C-93E4-4E149D72AE8F"},dVal=$(o).data('val'),isSel=false;
        $(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    if(item.id==dVal&&isSel==false){isSel=true;}
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(item.id==dVal?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        });
        if(isSel=true){loadOrganizationUserList(dVal);}
    },*/
    loadOrganizationUserList=function(accid){        
        var o='#frmDealerContactUsers'+settings.modId;$(o).html(''),f={"srcname":settings.personListSrcName,"accid":accid,"usrprmsn":settings.filterListByUserPermission},dVal=$(o).data('val'),isSel=false;
        if(!accid||accid==''){$(o).prop("disabled",true);return;}
        $(o).prop("disabled",false);
        $.ajax({
            url:settings.listSrcUrl+'&jsoncallback=?',
            dataType:'json',
            async:false,
            data:f,
            success:function(data){
               $(o).append('<option value="">&nbsp;</option>');
                $.map(data,function(item){
                    isSel=false;
                    if(dVal!=null){
                        $.each(dVal,function(i,v){
                            if(item.id==v){isSel=true;return false;}
                        });
                    }
                    $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(isSel==true?' selected="selected"':'')+'>'+item.title+'</option>');
                });
            }
        });
    },
    /*loadFriendList=function(){        
        var o='#frmUserAccountGUID'+settings.modId;$(o).html(''),f={"srcname":"getfriendlistbyuser"},dVal=$(o).data('val'),isSel=false;                
        var data=[{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a446","title":"Иванов Иван Иванович","logourl":"assets/img/1.png","subtitle":"Директор"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a447","title":"Петров Виталий Федорович","logourl":"assets/img/2.png","subtitle":"Бухгалтер"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a448","title":"Сидоров Степан Петрович","logourl":"assets/img/3.png","subtitle":"Завхоз"},{"id":"7f0fe6fc-7c90-4fe8-a7c8-34ec1508a449","title":"Ладыженский Евгений Николаевич","logourl":"assets/img/4.png","subtitle":"Заместитель бухгалтера"}];
        $(o).prop("disabled",false);        
        $(o).append('<option value="">&nbsp;</option>');
        $.map(data,function(item){
            if(item.id==dVal&&isSel==false){isSel=true;}
            $(o).append('<option value="'+item.id+'" data-meta=\''+JSON.stringify(item)+'\''+(item.id==dVal?' selected="selected"':'')+'>'+item.title+'</option>');
        });
    },*/    
    getMixResultTemp=function(s){        
        if (!s.id) {return s.text;}        
        var d=$(s.element).data('meta');
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';
        return m;
    },
    getMixSelectionTemp=function(s){        
        var d=$(s.element).data('meta');
        if (!d || typeof d!='object'){return s.text;} 
        var m='<div class="select2-result-repository">' +
                    '<div class="select2-result-repository__avatar"><img src="' + d.logourl + '" class="img-sm img-circle"/></div>' +
                    '<div class="select2-result-repository__meta">' +
                    '<div class="select2-result-repository__title">' + d.title + '</div>';
        if(d.subtitle){m+="<div class='select2-result-repository__subtitle'>" + d.subtitle + "</div>";}
        m+='</div>';        
        return m;
    },
    hideSelection=function(selectedObject){return false;},
    getValue=function(isRaw){
        var d,tp='',accGuid='',contactUsers='',anmsPersonDisplayName='',anmsPersonEmail='',anmsPersonPhone='';
        if($('ul#navAccountTabPane'+settings.modId+' li.active a').attr('href')=='#navAccountDealerTab'+settings.modId){            
            tp='organization';
            accGuid=$('#frmDealerAccountGUID'+settings.modId).data('val');
            contactUsers=JSON.stringify($('#frmDealerContactUsers'+settings.modId).data('val'));
            if(accGuid==null){accGuid=''}
            if(contactUsers==null){contactUsers=''}
            d={"type":tp,"accid":accGuid,"contacts":contactUsers};
        } 
        else {
            if(settings.anonymousPersonSelectEnable==true){
                tp='anonymous';
                anmsPersonDisplayName=$('#frmDisplayName'+settings.modId).val();
                anmsPersonEmail=$('#frmEmail'+settings.modId).val();
                anmsPersonPhone=$('#frmPhone'+settings.modId).val();
                d={"type":tp,"anonymousMeta":{"displayname":anmsPersonDisplayName,"email":anmsPersonEmail,"phone":anmsPersonPhone}};
            }else{
                tp='user';
                accGuid=$('#frmUserAccountGUID'+settings.modId).val();
                d={"type":tp,"accid":accGuid};
            }
        }
        return d
    },
    getShortFormData = function (isRaw, noEmpty) {
        if (!isRaw) { if (!$(settings.formid).valid()) { return null; } }
        var fvd = getFileData(isRaw);
        if (!fvd || typeof fvd != 'object') { return null; } if (fvd.length == 0) { return null; }
        var fvd_res = [];
        $.each(fvd, function (i, itm) {
            if (itm.srchble) { if (!noEmpty || !(itm.value == '' || itm.value == null)) { var d = { "name": itm.name, "type": itm.type, "val": itm.value }; fvd_res.push(d); } }
        });
        return fvd_res;

        
    };
})(jQuery);