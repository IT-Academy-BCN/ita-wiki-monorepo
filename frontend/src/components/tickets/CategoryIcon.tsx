import { FC } from "react";
import { TicketCategoryEnum } from "../../types/ticketingTypes";
import ErrorIcon from "../../assets/ticketing-category-error-icon.svg";
import SuggerimentIcon from "../../assets/ticketing-category-suggeriment-icon.svg";
import AltreIcon from "../../assets/ticketing-category-altre-icon.svg";
interface CategoryIconProps {
  category: TicketCategoryEnum;
}
const iconMap: Record<TicketCategoryEnum, string> = {
  [TicketCategoryEnum.BUG]: ErrorIcon,
  [TicketCategoryEnum.SUGGESTION]: SuggerimentIcon,
  [TicketCategoryEnum.OTHER]: AltreIcon,
};
const CategoryIcon: FC<CategoryIconProps> = ({ category }) => (
  <img src={iconMap[category]} alt={category} className="w-6 h-6" />
);
export default CategoryIcon;
