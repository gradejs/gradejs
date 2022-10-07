// @ts-nocheck

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './TreeMap.module.scss';

type Module = {
  name: string;
  value: number;
};

type Data = {
  name: string;
  children: Module[];
};

type Props = {
  data: Data;
  height?: number;
  smallestModuleSize?: number;
  largestModuleSize?: number;
};

const TreeMap = ({ data, height = 212, smallestModuleSize, largestModuleSize }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [containerRef, windowWidth]);

  function renderTreemap() {
    if (containerWidth === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('g').remove();

    const root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    const modulesCount = data.children.length;
    const heightIncrease = windowWidth > 1200 ? 15 : 30;
    const addHeight = modulesCount > 5 ? (modulesCount - 5) * heightIncrease : 0;
    const containerHeight = height + addHeight;

    const treemapRoot = d3.treemap().size([containerWidth, containerHeight]).paddingInner(4)(root);

    svg.attr('width', containerWidth).attr('height', containerHeight);

    const nodes = svg
      .selectAll('g')
      .data(treemapRoot.leaves())
      .join('g')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    const color = d3.scaleOrdinal().range(['#49D581']);
    const opacity = d3
      .scaleLinear()
      .domain([
        smallestModuleSize !== largestModuleSize ? smallestModuleSize : 1,
        largestModuleSize,
      ])
      .range([0.2, 1]);

    // render rectangles with fill color and opacity based on value
    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('rx', 10)
      .attr('fill', (d) => color(d.data.category))
      .attr('opacity', (d) => opacity(d.data.value));

    // wrap future <text> nodes inside <svg> to allow easier centering via text-anchor: middle
    const textWrappers = nodes
      .append('svg')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('color', (d) => {
        if (opacity(d.data.value) < 0.7) {
          return '#338159';
        } else {
          return 'white';
        }
      });

    // render text title (module path)
    textWrappers
      .append('text')
      .text((d) => d.data.name)
      .attr('class', styles.treemapTitle)
      .attr('text-anchor', 'middle')
      .attr('x', '50%')
      .attr('y', '50%')
      .attr('dy', '-0.5em');

    // render text value (module size)
    textWrappers
      .append('text')
      .text((d) => `${d.data.value} B`)
      .attr('class', styles.treemapValue)
      .attr('text-anchor', 'middle')
      .attr('x', '50%')
      .attr('y', '50%')
      .attr('dy', '0.875em');

    const containers = svg.selectAll('g rect').nodes();
    const textNodes = svg.selectAll('g svg text:first-child').nodes();

    // hide text node if width is bigger than parent
    textWrappers.style('display', (d, idx) => {
      const { width: childWidth, height: childHeight } = textNodes[idx].getBoundingClientRect();
      const { width: parentWidth, height: parentHeight } = containers[idx].getBoundingClientRect();

      if (childWidth > parentWidth || childHeight > parentHeight) {
        return 'none';
      }
    });
  }

  useLayoutEffect(() => {
    renderTreemap();
  }, [data, windowWidth]);

  return (
    <div ref={containerRef} className={styles.svgWrapper}>
      <svg ref={svgRef} className={styles.treemap} />
    </div>
  );
};

export default TreeMap;
