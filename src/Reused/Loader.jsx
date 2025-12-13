import React from "react";
import { Flex, Spin } from "antd";
import { createStyles } from "antd-style";
const useStyle = createStyles(({ css }) => ({
  root: css`
    padding: 8px;
    width: 40%;
  `,
}));
const stylesObject = {
  indicator: {
    color: "#00d4ff",
  },
};
const stylesFn = ({ props }) => {
  if (props.size === "small") {
    return {
      indicator: {
        color: "#722ed1",
      },
    };
  }
  return {};
};
const Loader = () => {
  const { styles } = useStyle();
  const sharedProps = {
    spinning: true,
    percent: 0,
    classNames: { root: styles.root },
  };
  return (
    <Flex align="center" gap="middle">
      <Spin {...sharedProps} styles={stylesObject} />
      <Spin {...sharedProps} styles={stylesFn} size="small" />
    </Flex>
  );
};
export default Loader;
