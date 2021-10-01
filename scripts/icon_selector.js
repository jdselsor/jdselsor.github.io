let darkmode = window.matchMedia('(prefers-color-scheme: dark)').matches;
var icon_link = document.getElementById("icon-id");

if (darkmode)
    icon_link.href = "./assets/images/code_file_icon_darkmode.png";
else
    icon_link.href = "./assets/images/code_file_icon.png";
