# Generated by Django 4.2.15 on 2024-08-26 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("corpuses", "0011_corpusaction_name_alter_corpusaction_trigger"),
    ]

    operations = [
        migrations.AddField(
            model_name="corpusaction",
            name="disabled",
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AddField(
            model_name="corpusaction",
            name="run_on_all_corpuses",
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
