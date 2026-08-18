document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".math-note-body p, .math-note-body div, .math-note-body li").forEach(function (el) {
    var source = el.innerHTML;
    if (source.indexOf("$$") === -1 && source.indexOf("\\[") === -1) return;

    source = source.replace(/\\\[([\s\S]*?)\\\]/g, function (_, expression) {
      return "\\[" + expression.replace(/<br\s*\/?>/g, "\n") + "\\]";
    });
    source = source.replace(/\$\$([\s\S]*?)\$\$/g, function (_, expression) {
      return expression.indexOf("<") === -1
        ? "$$" + expression + "$$"
        : "\\[" + expression.replace(/<br\s*\/?>/g, "\n") + "\\]";
    });
    el.innerHTML = source;
  });

  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "$", right: "$", display: false }
    ],
    throwOnError: false
  });
});
