import { TOOLTIP_CLASS, TOOLTIP_ROOT_SELECTOR } from 'constants';
import { cn } from './bem';

type TooltipProp = {
  message: string;
  type: 'error' | 'success';
};

const cnTooltip = cn(TOOLTIP_CLASS);

const tooltip = document.createElement('div');
tooltip.classList.add(cnTooltip());

function showTooltip({ message, type }: TooltipProp) {
  const tooltipRoot = document.querySelector(TOOLTIP_ROOT_SELECTOR)!;
  const classes = type === 'success' ? cnTooltip('success') : cnTooltip('error');
  tooltip.textContent = message;

  tooltip.classList.add(classes);
  tooltipRoot.replaceChildren(tooltip);

  tooltip.addEventListener('click', handleCloseTooltip);

  setTimeout(() => {
    tooltip.classList.remove(classes);
    tooltipRoot.contains(tooltip) && tooltipRoot.removeChild(tooltip);
  }, 3500);
}

function handleCloseTooltip() {
  document.body.removeChild(tooltip);
}

export { showTooltip };
