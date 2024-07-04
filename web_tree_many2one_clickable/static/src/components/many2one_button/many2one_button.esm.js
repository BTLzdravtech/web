/** @odoo-module */
/* Copyright 2013 Therp BV (<http://therp.nl>).
 * Copyright 2015 Pedro M. Baeza <pedro.baeza@serviciosbaeza.com>
 * Copyright 2016 Antonio Espinosa <antonio.espinosa@tecnativa.com>
 * Copyright 2017 Sodexis <dev@sodexis.com>
 * Copyright 2018 Camptocamp SA
 * Copyright 2019 Alexandre Díaz <alexandre.diaz@tecnativa.com>
 * Copyright 2024 Versada (https://versada.eu)
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl). */

import {patch} from "@web/core/utils/patch";
import {ListRenderer} from "@web/views/list/list_renderer";
import {useService} from "@web/core/utils/hooks";

patch(ListRenderer.prototype, {
    setup() {
        this.actionService = useService("action");
        super.setup(...arguments);
    },
    async onClickM2oButton(record, column, ev) {
        ev.stopPropagation();
        const field = record.fields[column.name];
        const value = record.data[column.name];
        if (ev.which === 2 || (ev.which === 1 && (ev.ctrlKey || ev.metaKey))) {
            ev.preventDefault();
            let url = '/web#model=' + field.relation + '&id=' + value[0] + '&view_type=form';

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
                res_model: field.relation,
                res_id: value[0],
                views: [[false, "form"]],
                target: "target",
                additionalContext: column.context || {},
            });
        }
    },
});
