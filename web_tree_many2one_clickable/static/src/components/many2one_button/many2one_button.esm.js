/** @odoo-module */
/* Copyright 2013 Therp BV (<http://therp.nl>).
 * Copyright 2015 Pedro M. Baeza <pedro.baeza@serviciosbaeza.com>
 * Copyright 2016 Antonio Espinosa <antonio.espinosa@tecnativa.com>
 * Copyright 2017 Sodexis <dev@sodexis.com>
 * Copyright 2018 Camptocamp SA
 * Copyright 2019 Alexandre Díaz <alexandre.diaz@tecnativa.com>
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */

import {ListRenderer} from "@web/views/list/list_renderer";
import {Component} from "@odoo/owl";
import {useService} from "@web/core/utils/hooks";

export class TreeMany2oneClickableButton extends Component {
    setup() {
        this.actionService = useService("action");
    }

    async onClick(ev) {
        ev.stopPropagation();
        if (ev.which === 2 || (ev.which === 1 && (ev.ctrlKey || ev.metaKey))) {
            ev.preventDefault();
            ev.stopPropagation();
            let url = '/web#model=' + this.props.field.relation + '&id=' + this.props.value[0] + '&view_type=form';

            let context = this.props.context;

            if (context && context.hasOwnProperty('params') && context.params.menu_id) {
                url += '&menu_id=' + context.params.menu_id
            } else {
                const matches = location.href.match(/menu_id=\d+/)
                if (matches !== null) {
                    url += '&' + matches[0]
                }
            }
            window.open(url, '_blank');
        } else {
            return this.actionService.doAction({
                type: "ir.actions.act_window",
                res_model: this.props.field.relation,
                res_id: this.props.value[0],
                views: [[false, "form"]],
                target: "target",
                additionalContext: this.props.context || {},
            });
        }
    }
}
TreeMany2oneClickableButton.template = "web_tree_many2one_clickable.Button";

Object.assign(ListRenderer.components, {TreeMany2oneClickableButton});
