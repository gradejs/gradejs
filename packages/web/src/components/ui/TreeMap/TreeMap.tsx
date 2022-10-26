import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getReadableSizeString } from 'utils/helpers';
import styles from './TreeMap.module.scss';
import { ClientApi } from 'services/apiClient';

type Props = {
  modules: Pick<ClientApi.IdentifiedModule, 'packageFile' | 'approximateByteSize'>[];
  minHeight?: number;
};

export default function TreeMap({ modules, minHeight = 200 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(__IS_SERVER__ ? 0 : window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef, windowWidth]);

  // Render D3
  useLayoutEffect(() => {
    if (containerWidth === 0 || modules.length === 0) {
      return;
    }

    // Right now we may observe collisions in matched modules due to inaccurate module matching
    // So we want to merge module sizes by it's path
    const mergedModuleSizesByPath = new Map<string, { name: string; value: number }>();
    modules.forEach((module) => {
      const moduleData = mergedModuleSizesByPath.get(module.packageFile);

      if (moduleData) {
        moduleData.value += module.approximateByteSize;
      } else {
        mergedModuleSizesByPath.set(module.packageFile, {
          name: module.packageFile,
          value: module.approximateByteSize,
        });
      }
    });

    const svg = d3.select(svgRef.current);
    const smallestSize = d3.min(modules, (it) => it.approximateByteSize) ?? 0;
    const largestSize = d3.max(modules, (it) => it.approximateByteSize) ?? 0;
    const scaleFn = d3.scaleLog().domain([smallestSize, largestSize]).range([1, 10, 100]);

    const heightIncreaseStep = windowWidth > 1200 ? 15 : 30;
    const containerHeight = minHeight + (modules.length - 1) * heightIncreaseStep;
    const opacity = d3
      .scaleLinear()
      .domain([smallestSize !== largestSize ? smallestSize : 0, largestSize])
      .range([0.2, 1]);

    svg.selectAll('g').remove();
    svg.attr('width', containerWidth).attr('height', containerHeight);

    const data = {
      name: 'root',
      value: 0,
      children: Array.from(mergedModuleSizesByPath.values()),
    };

    const dataRoot = d3.hierarchy(data).sum((d) => scaleFn(d.value));
    const root = d3
      .treemap<typeof data>()
      .size([containerWidth, containerHeight])
      .paddingInner(4)
      .tile(d3.treemapBinary)(dataRoot);

    const nodes = svg
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    const rects = nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('rx', 10)
      .attr('fill', '#49D581')
      .attr('opacity', (d) => opacity(d.data.value));

    const foreignObjects = nodes
      .append('foreignObject')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('color', (d) => (opacity(d.data.value) < 0.7 ? '#338159' : 'white'))
      .html((d) => getLabelHTML(d.data));

    const containers = rects.nodes();
    const textContainers = foreignObjects.selectChild<HTMLDivElement>();
    const textLabels = textContainers.selectChild<HTMLDivElement>().nodes();

    textContainers.style('transform', (_, idx) => {
      const sizeLabelHeight = 20;
      const padding = 10;
      const { width: labelWidth, height: labelHeight } = textLabels[idx].getBoundingClientRect();
      const { width: rectWidth, height: rectHeight } = containers[idx].getBoundingClientRect();

      const scale = Math.min(
        rectWidth / (labelWidth + padding),
        rectHeight / (labelHeight + padding + sizeLabelHeight)
      );

      return scale < 1 ? `scale(${scale})` : 'none';
    });
  }, [modules, containerWidth, windowWidth]);

  if (modules.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.svgWrapper}>
      <svg ref={svgRef} className={styles.treemap} />
    </div>
  );
}

function getLabelHTML(data: { name: string; value: number }) {
  const titleWithWordBreaks = data.name.replace(/\//g, `<wbr/>/`);

  return `
    <body>
      <div class=${styles.labelContainer}>
        <div class=${styles.labelText}>${titleWithWordBreaks}</div>
        <div class=${styles.labelSize}>${getReadableSizeString(data.value)}</div>
      </div>
    </body>
  `;
}
