﻿// Selected Element on list, for use in other JS functions
var SelectedElem = "";

function initContextMenu() {
    $(".acc_list").on("click", function() {
        $("input:checked").each(function(_, e) {
            $(e).prop("checked", false);
        });
    });

    // Ready accounts for double-click
    $(".acc_list_item").dblclick(function(event) {
        SwapTo(-1, event);
    });

    // Handle Left-clicks:
    $(".acc_list_item").click(function(e) {
        $(e.currentTarget).children('input')[0].click();
        e.stopPropagation();
    });

    //Show contextmenu on Right-Click:
    $(".acc_list_item").contextmenu(function(e) {
        // Select item that was right-clicked.
        $(e.currentTarget).children('input').click();

        // Set currently selected element
        SelectedElem = $(e.currentTarget).children('input')[0];
        // Update status for element
        switch (getCurrentPage()) {
            case "Steam":
                updateStatus("Selected: " + $(SelectedElem).attr("Line2"));
                break;
            case "Origin":
                updateStatus("Selected: " + $(SelectedElem).attr("id"));
                break;
            case "Ubisoft":
                updateStatus("Selected: " + $(SelectedElem).attr("Username"));
                break;
            default:
                break;
        }


        //Get window size:
        var winWidth = $(document).width();
        var winHeight = $(document).height();
        //Get pointer position:
        var posX = e.pageX - 14;
        var posY = e.pageY - 42; // Offset for header bar
        //Get contextmenu size:
        var menuWidth = $(".contextmenu").width();
        var menuHeight = $(".contextmenu").height();
        //Security margin:
        var secMargin = 10;
        //Prevent page overflow:
        if (posX + menuWidth + secMargin >= winWidth &&
            posY + menuHeight + secMargin >= winHeight) {
            //Case 1: right-bottom overflow:
            posLeft = posX - menuWidth - secMargin + "px";
            posTop = posY - menuHeight - secMargin + "px";
        } else if (posX + menuWidth + secMargin >= winWidth) {
            //Case 2: right overflow:
            posLeft = posX - menuWidth - secMargin + "px";
            posTop = posY + secMargin + "px";
        } else if (posY + menuHeight + secMargin >= winHeight) {
            //Case 3: bottom overflow:
            posLeft = posX + secMargin + "px";
            posTop = posY - menuHeight - secMargin + "px";
        } else {
            //Case 4: default values:
            posLeft = posX + secMargin + "px";
            posTop = posY + secMargin + "px";
        };
        //Display contextmenu:
        $(".contextmenu").css({
            "left": posLeft,
            "top": posTop
        }).show();
        //Prevent browser default contextmenu.
        return false;
    });

    // Check element fits on page, and move if it doesn't
    // This function moves the element to the left if it doesn't fit.
    var contextMenu = document.getElementsByClassName("contextmenu")[0];
    var rightSpace = 0;

    function moveContextMenu(submenuSize) {
        rightSpace = $(contextMenu).position().left + $(contextMenu).width() + submenuSize - window.innerWidth;
        if (rightSpace > 0) {
            $(contextMenu).css('left', $(contextMenu).position().left - rightSpace);
        }
    }
    // Define resizeObserver and add it to every submenu on the page.
    var resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            moveContextMenu(entry.contentRect.width);
        }
    });
    for (let item of document.getElementsByClassName("submenu")) {
        resizeObserver.observe(item);
    }

    //Hide contextmenu:
    $(document).click(function() {
        $(".contextmenu").hide();
    });
};

function SelectedItemChanged() {
    // Different function groups based on platform
    updateStatus("Selected: " + $("input[name=accounts]:checked").attr("DisplayName"));
}