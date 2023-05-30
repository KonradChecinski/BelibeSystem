export default function isChildActive(children) {
    // console.log(children);
    if (children === undefined) {
        // console.log("1", false);
        return false;
    }
    if (children.length === undefined) {
        if (children.props.children === undefined) {
            // console.log("2", children.props.active);
            return children.props.active;
        } else {
            // console.log("3", isChildActive(children.props.children));
            return isChildActive(children.props.children);
        }
    } else {
        let result = false;
        for (let i = 0; i < children.length; i++) {
            if (children[i].props.children === undefined) {
                // console.log("4", children[i].props.active);
                result ||= children[i].props.active;
            } else {
                // console.log("5", isChildActive(children[i].props.children));
                result ||= isChildActive(children[i].props.children);
            }
            // console.log("6", isChildActive(children[i].props.children));
            result ||= isChildActive(children[i].props.children);
            // console.log(result);
        }
        return result;
    }
    // console.log("7", children.props.active);
    return children.props.active;
}
