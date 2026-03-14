/**
 * Domino Flow — 인과관계 트리 시각화.
 * Renders ImpactNodes as a vertical domino-style flow diagram.
 * Pure CSS/Tailwind + motion — no external graph library.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface TreeNode {
  node: Doc<"impactNodes">;
  children: TreeNode[];
}

/** Build tree from flat node array using parentNodeId */
function buildTree(nodes: Doc<"impactNodes">[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const node of nodes) {
    map.set(node._id, { node, children: [] });
  }

  for (const node of nodes) {
    const treeNode = map.get(node._id)!;
    if (node.parentNodeId && map.has(node.parentNodeId)) {
      map.get(node.parentNodeId)!.children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }

  const sortChildren = (tn: TreeNode) => {
    tn.children.sort((a, b) => a.node.ordinal - b.node.ordinal);
    tn.children.forEach(sortChildren);
  };
  roots.sort((a, b) => a.node.ordinal - b.node.ordinal);
  roots.forEach(sortChildren);

  return roots;
}

interface DominoFlowProps {
  nodes: Doc<"impactNodes">[];
}

export function DominoFlow({ nodes }: DominoFlowProps) {
  const tree = buildTree(nodes);

  if (tree.length === 0) {
    return (
      <div data-label="impactChain.domino.empty" className="text-center py-8">
        <p className="text-sm text-ink-muted/50">아직 노드가 없습니다</p>
      </div>
    );
  }

  return (
    <div data-label="impactChain.domino" className="space-y-0">
      {tree.map((root, i) => (
        <DominoNode key={root.node._id} treeNode={root} depth={0} index={i} isLast={i === tree.length - 1} />
      ))}
    </div>
  );
}

interface DominoNodeProps {
  treeNode: TreeNode;
  depth: number;
  index: number;
  isLast: boolean;
}

function DominoNode({ treeNode, depth, index }: DominoNodeProps) {
  const { node, children } = treeNode;
  const isRoot = depth === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (depth * 0.15) + (index * 0.08), duration: 0.3 }}
      className={cn(
        "relative",
        depth > 0 && "ml-6",
      )}
    >
      {/* Connector line from parent */}
      {depth > 0 && (
        <div className="absolute -left-3 top-0 bottom-0 w-px bg-white/10" />
      )}

      {/* Horizontal branch line */}
      {depth > 0 && (
        <div className="absolute -left-3 top-5 w-3 h-px bg-white/10" />
      )}

      {/* Node card */}
      <div
        data-label="impactChain.domino.node"
        className={cn(
          "relative rounded-lg border p-3 mb-2",
          isRoot
            ? "glass-panel border-accent-3/30 bg-accent-3/[0.06]"
            : "glass-panel border-white/8",
        )}
      >
        {/* Dot */}
        <span
          className={cn(
            "absolute -left-[7px] top-[18px] size-2.5 rounded-full border",
            isRoot
              ? "bg-accent-3/60 border-accent-3/40"
              : "bg-white/15 border-white/20",
            depth === 0 && "hidden",
          )}
        />

        {/* Label */}
        <p className={cn(
          "text-[13px] font-medium leading-snug",
          isRoot ? "text-accent-3" : "text-ink",
        )}>
          {node.labelKo}
        </p>

        {/* Description */}
        {node.descriptionKo && (
          <p className="mt-1 text-[11px] text-ink-muted/60 leading-snug line-clamp-2">
            {node.descriptionKo}
          </p>
        )}

        {/* Depth indicator */}
        {isRoot && (
          <span className="mt-1.5 inline-block text-[9px] uppercase tracking-wider text-accent-3/50 font-semibold">
            root
          </span>
        )}
      </div>

      {/* Children */}
      {children.length > 0 && (
        <div className="relative">
          {children.map((child, ci) => (
            <DominoNode
              key={child.node._id}
              treeNode={child}
              depth={depth + 1}
              index={ci}
              isLast={ci === children.length - 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
