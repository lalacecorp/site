$(function(){
    var FolderPathStack = [""];
	var render = function(pg, folderPath, inStack){
        var page = pg,
            folderPath = folderPath,
            inStack = inStack;
        if (typeof inStack === "undefined") inStack = true
        if (typeof pg === "undefined") page = 1
        if (typeof folderPath === "undefined") folderPath = ''
        page = parseInt(pg);
        $('.clist').remove();
        $('.catalog-listing').append($('<div class="clist">'));
        $('.loading-gif').fadeIn( "slow" )
        var url = '/api/catalog/page/' + (page-1);
        var purl = '/api/catalog/length';
        if (folderPath != ''){
            if (inStack) FolderPathStack.push(folderPath);
            url = '/api/catalog/folder/' + folderPath + '/page/' + (page-1)
            purl = '/api/catalog/folder/' + folderPath + '/length'
            $('.up_to_parent_div').fadeIn( "slow" )
            $('.current_folder').text(folderPath);
        } else {
            $('.up_to_parent_div').hide();
            $('.current_folder').text(folderPath);
        }
        $.ajax({
            url: purl,
            type: "GET",
            dataType : "json",
            success: function(data){
                $('.total_pages').text(data.pages)
            }
        })

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data){
                if (data.length > 0){
                    res = $('<div class="clist">');
                    for (var i=0; i < 16; i++){
                        if(i%4 == 0){
                            if (i != 0){
                                res.append(row);
                            }
                            row = $('<div class="row" style="margin-top: 50px; margin-bottom: 50px;">');
                        }
                        current = data[i];
                        if (typeof current === "undefined") {
                            res.append(row);
                            break;
                        }

                        toAdd = $('<div class="three columns">');
                        html ='';
                        if(typeof current.folder !== "undefined" && current.folder){
                            html = "<a href='#' class='render_folder' folder='" + current.thumbnail.path + "'>" + "<img folder='" + current.thumbnail.path + "' class='render-folder' src='/api/thumbs/get/"+ current.thumbnail.path +"/" + current.thumbnail.name + "'><br>" + current.name + "</a>";
                        } else {
                            var nameWOfileExt = current.name.split('.',2)[0]
                            if (folderPath != ""){
                                html = "<a href='/api/pictures/get/" + current.path + "/" + current.name + "'  data-lightbox='"+ nameWOfileExt + "' data-title='"+ nameWOfileExt +"'>";
                                html += "<img src='/api/thumbs/get/" + current.path + "/" + current.name +"'><br>" + nameWOfileExt + "</a>";
                           } else {
                                html = "<a href='/api/pictures/get/" + current.name + "'  data-lightbox='"+ nameWOfileExt + "' data-title='"+ nameWOfileExt +"'>";
                                html += "<img src='/api/thumbs/get/" + current.name + "'><br>" + nameWOfileExt + "</a>";
                           }
                        }
                        row.append(toAdd.html(html));
                        if (i === 16-1){
                            res.append(row);
                        }
                    }
                    $('.catalog-listing').html(res);
                    $('.loading-gif').hide();
                    $('.render-folder').on("click", function(e){
                        render(1, $(e.target).attr("folder"))
                    });
                }
            }
        })
    }

    render(1);

    var getPageNumber = function(){
        return parseInt($('input[name=page]').val());
    }

    var setPageNumber = function(page){
        $('input[name=page]').val(page);
    }

    var getMaxPages = function(){
        return parseInt($('.total_pages').text());
    }

    var goToParent = function(){
        FolderPathStack.pop();
        var parent = FolderPathStack[FolderPathStack.length - 1]
        if (parent == ""){
            FolderPathStack[0] = "";
            $('.up_to_parent_div').hide();
        }
        render(1, parent, false);
    }

    $('.render_home').on("click", function(){
        render(1);
    })

    $('.render_prev_page').on("click", function(){
        var nextPage = getPageNumber() - 1;
        if(nextPage > 0) {
            setPageNumber(nextPage);
            render(nextPage);
        }
    })
    $('.render_next_page').on("click", function(){
        var nextPage = getPageNumber() + 1;
        if(nextPage < getMaxPages()){
            setPageNumber(nextPage);
            render(nextPage);
        }
    })
    $('.go_to_page').on("click", function(){
        var nextPage = getPageNumber();
        if (nextPage > 0 && nextPage < getMaxPages()){
            render(nextPage);
        }
    });
    $('.up_to_parent').on("click", goToParent)
});