import { ContainerNode } from './containernode'
import { svgNodeAndChildrenVisible, getAttribute } from '../utils/node'
import { Context } from '../context/context'
import { getBoundingBoxByChildren, addLineWidth } from '../utils/bbox'
import { parseFloats } from '../utils/math'
import { computeViewBoxTransform } from '../utils/transform'

export class Symbol extends ContainerNode {
  render(context: Context) {
    if (context.refsHandler.renderedElements[this.element.id] === 'todo') {
      super.render(context)
    }
  }
  getBoundingBoxCore(context: Context): number[] {
    return addLineWidth(getBoundingBoxByChildren(context, this), this)
  }
  isVisible(parentVisible: boolean): boolean {
    return svgNodeAndChildrenVisible(this, parentVisible)
  }
  computeNodeTransformCore(context: Context) {
    const x = parseFloat(getAttribute(this.element, 'x')) || 0
    const y = parseFloat(getAttribute(this.element, 'y')) || 0
    // TODO: implement refX/refY - this is still to do because common browsers don't seem to support the feature yet
    // x += parseFloat(this.element.getAttribute("refX")) || 0; ???
    // y += parseFloat(this.element.getAttribute("refY")) || 0; ???

    const viewBox = this.element.getAttribute('viewBox')
    if (viewBox) {
      const box = parseFloats(viewBox)
      const width = parseFloat(
        getAttribute(this.element, 'width') ||
          getAttribute((this.element as any).ownerSVGElement, 'width')
      )
      const height = parseFloat(
        getAttribute(this.element, 'height') ||
          getAttribute((this.element as any).ownerSVGElement, 'height')
      )
      return computeViewBoxTransform(this.element, box, x, y, width, height, context)
    } else {
      return new context._pdf.Matrix(1, 0, 0, 1, x, y)
    }
  }
}
