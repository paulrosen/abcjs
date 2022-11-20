import drawSeparator from './separator';
import renderText from './text';

function nonMusic(renderer: any, obj: any, selectables: any) {
  for (var i = 0; i < obj.rows.length; i++) {
    var row = obj.rows[i];
    if (row.absmove) {
      renderer.absolutemoveY(row.absmove);
    } else if (row.move) {
      renderer.moveY(row.move);
    } else if (row.text) {
      var x = row.left ? row.left : 0;
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
      var el = renderText(renderer, {
        x: x,
        y: renderer.y,
        text: row.text,
        type: row.font,
        klass: row.klass,
        name: row.name,
        anchor: row.anchor
      });
      if (row.absElemType) {
        selectables.wrapSvgEl(
          {
            el_type: row.absElemType,
            name: row.name,
            startChar: row.startChar,
            endChar: row.endChar,
            text: row.text
          },
          el
        );
      }
    } else if (row.separator) {
      drawSeparator(renderer, row.separator);
    } else if (row.startGroup) {
      renderer.paper.openGroup({ klass: row.klass, "data-name": row.name });
    } else if (row.endGroup) {
      // TODO-PER: also create a history element with the title "row.endGroup"
      var g = renderer.paper.closeGroup();
      if (row.absElemType)
        selectables.wrapSvgEl(
          {
            el_type: row.absElemType,
            name: row.name,
            startChar: row.startChar,
            endChar: row.endChar,
            text: ""
          },
          g
        );
    }
  }
}

export default nonMusic;
