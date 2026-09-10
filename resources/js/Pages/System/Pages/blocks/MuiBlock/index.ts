export * from "./Accordion";
export * from "./Button";
export * from "./ButtonGroup";
export * from "./Card";
export * from "./Columns";
export * from "./Container";
export * from "./Divider";
export * from "./Heading";
export * from "./Paper";
export * from "./Paragraph";
export * from "./Typography";

import { PAccordion } from "./Accordion";
import { PButton } from "./Button";
import { PButtonGroup } from "./ButtonGroup";
import { PCard } from "./Card";
import { PColumns } from "./Columns";
import { PContainer } from "./Container";
import { PDivider } from "./Divider";
import { PHeading } from "./Heading";
import { PPaper } from "./Paper";
import { PParagraph } from "./Paragraph";
import { PTypography } from "./Typography";

/**
 * Zbiorcza mapa komponentów MUI dla Puck Config.
 * Możesz ją przekazać bezpośrednio do config.components w edytorze Puck.
 */
export const puckMuiComponents = {
  accordion: PAccordion,
  button: PButton,
  buttonGroup: PButtonGroup,
  card: PCard,
  column: PColumns,
  columns: PColumns,
  container: PContainer,
  divider: PDivider,
  heading: PHeading,
  paper: PPaper,
  paragraph: PParagraph,
  typography: PTypography,
};

export default puckMuiComponents;
