export default function isChildActive(children) {
    if (children === undefined) {
        return false;
    }
    if (children.length === undefined) {
        if (children.props.children === undefined) {
            return children.props.active;
        } else {
            return isChildActive(children.props.children);
        }
    } else {
        for (let i = 0; i < children.length; i++) {
            if (children[i].props.children === undefined) {
                return children[i].props.active;
            } else {
                return isChildActive(children[i].props.children);
            }
            return isChildActive(children[i].props.children);
        }
    }
    return children.props.active;
}
