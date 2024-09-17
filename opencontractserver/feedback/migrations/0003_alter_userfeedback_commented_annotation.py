# Generated by Django 4.2.16 on 2024-09-15 13:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        (
            "annotations",
            "0017_remove_annotationlabel_only_install_one_label_of_given_name_for_each_analyzer_id_no_duplicates__and_",
        ),
        ("feedback", "0002_alter_userfeedback_options"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userfeedback",
            name="commented_annotation",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="user_feedback",
                to="annotations.annotation",
            ),
        ),
    ]
