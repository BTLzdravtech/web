# Copyright 2017 ACSONE SA/NV
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
import os
import re

from odoo import api, models


class WebEnvironmentRibbonBackend(models.AbstractModel):
    _name = "web.environment.ribbon.backend"
    _description = "Web Environment Ribbon Backend"

    @api.model
    def _prepare_ribbon_format_vals(self):
        dbname = self.env.cr.dbname
        regex_match_dev = re.search("^btlnet-(.*)-[0-9]+$", self.env.cr.dbname)
        if regex_match_dev and regex_match_dev.group(1):
            dbname = regex_match_dev.group(1)
        return {"db_name": dbname}

    @api.model
    def _prepare_ribbon_name(self):
        name_tmpl = self.env["ir.config_parameter"].sudo().get_param("ribbon.name")
        if os.environ.get("ODOO_STAGE"):
            name_tmpl = name_tmpl.replace('TEST', os.environ.get("ODOO_STAGE").upper())
        vals = self._prepare_ribbon_format_vals()
        return name_tmpl and name_tmpl.format(**vals) or name_tmpl

    @api.model
    def get_environment_ribbon(self):
        """
        This method returns the ribbon data from ir config parameters
        :return: dictionary
        """
        ir_config_model = self.env["ir.config_parameter"]
        name = self._prepare_ribbon_name()

        if os.environ.get("ODOO_STAGE") == "production":
            name = False

        return {
            "name": name,
            "color": ir_config_model.sudo().get_param("ribbon.color"),
            "background_color": ir_config_model.sudo().get_param(
                "ribbon.background.color"
            ),
        }
