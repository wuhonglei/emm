/**
 * 组件库按需引入界面
 */

import Vue from 'vue';
import { 
    Select,
    Table,
    TableColumn,
    Pagination,
    Input,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxGroup,
    Switch,
    Option,
    OptionGroup,
    Button,
    ButtonGroup,
    Col,
    DatePicker,
    TimeSelect,
    TimePicker,
    Dialog,
    Loading,
    Form,
    FormItem,
    Popover,
    Message,
    MessageBox,
    Row,
    SelectTree,
    Tree,
    Progress,
    Tag,
    Tooltip,
    Notification,
    Dropdown,
    DropdownMenu,
    DropdownItem
} from '@sxf/pear';
import(/* webpackChunkName: "elementui" */ '@sxf/pear/lib/theme-default/index.css');

Vue.use(Select);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Col);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Dialog);
Vue.use(Loading.directive);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Popover);
Vue.use(SelectTree);
Vue.use(Tree);
Vue.use(Progress);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$error = function (err, title) {

    // 兼容以前的写法，以前的写法可以不用改
    if (typeof err === 'string') {
        MessageBox.error(err, title);
        return;
    }

    // 生产环境不将错误堆栈爆出
    let message = err.data && err.data.mesg;
    if (process.env.NODE_ENV === 'production') {
        MessageBox.error(message || title, title);
    } else {
        MessageBox.error(message || err.stack || title, title);
    }
};
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$warning = MessageBox.warning;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
