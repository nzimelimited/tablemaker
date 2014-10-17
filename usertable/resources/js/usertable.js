/**
 * @author		Supercool Ltd <josh@supercooldesign.co.uk>
 * @copyright Copyright (c) 2014, Supercool Ltd
 * @see			 http://supercooldesign.co.uk
 */

(function($){


/**
 * UserTable Class
 *
 * An awful lot of this is taken directly from TableFieldsSettings.js
 */
Craft.UserTable = Garnish.Base.extend(
{

	columnsTableId: null,
	rowsTableId: null,
	columnsTableName: null,
	rowsTableName: null,
	columnsTableInputPath: null,
	rowsTableInputPath: null,
	columns: null,
	rows: null,
	columnSettings: null,

	columnsTable: null,
	rowsTable: null,

	$columnsTable: null,
	$rowsTable: null,

	init: function(columnsTableId, rowsTableId, columnsTableName, rowsTableName, columns, rows, columnSettings)
	{

		this.columnsTableId = columnsTableId;
		this.rowsTableId = rowsTableId;
		this.columnsTableName = columnsTableName;
		this.rowsTableName = rowsTableName;
		this.columnsTableInputPath = this.columnsTableId.split('-');
		this.rowsTableInputPath = this.rowsTableId.split('-');
		this.columns = columns;
		this.rows = rows;
		this.columnSettings = columnSettings;


		this.$columnsTable = $('#'+this.columnsTableId);
		this.$rowsTable = $('#'+this.rowsTableId);


		// set up columns table
		this.columnsTable = new Craft.EditableTable(this.columnsTableId, this.columnsTableName, this.columnSettings, {
			rowIdPrefix: 'col',
			onAddRow: $.proxy(this, 'onAddRow'),
			onDeleteRow: $.proxy(this, 'reconstructRowsTable')
		});

		this.bindColumnsTableTextChanges(this.columnsTable.$tbody);

		this.columnsTable.sorter.settings.onSortChange = $.proxy(this, 'reconstructRowsTable');

		// set up rows table
		this.initRowsTable();

	},

	onAddRow: function($tr)
	{

		this.bindColumnsTableTextChanges($tr);
		this.reconstructRowsTable();

	},

	bindColumnsTableTextChanges: function($container)
	{

		var $textareas = $container.find('textarea');
		this.addListener($textareas, 'textchange', 'reconstructRowsTable');

	},

	initRowsTable: function()
	{

		this.rowsTable = new Craft.EditableTable(this.rowsTableId, this.rowsTableName, this.columns, {
			rowIdPrefix: 'row',
			onAddRow: $.proxy(this, 'makeDataBlob'),
			onDeleteRow: $.proxy(this, 'makeDataBlob')
		});

	},

	reconstructRowsTable: function()
	{

		// get data out from the tables
		var columnsTableData = Craft.expandPostArray(Garnish.getPostData(this.columnsTable.$tbody)),
			rowsTableData = Craft.expandPostArray(Garnish.getPostData(this.rowsTable.$tbody)),
			columns = columnsTableData,
			rows = rowsTableData;

		// travel down the input path to find where the data we’re interested in actually is
		for (var i = 0; i < this.columnsTableInputPath.length; i++)
		{
			var key = this.columnsTableInputPath[i];
			columns = columns[key];
		}

		for (var i = 0; i < this.rowsTableInputPath.length; i++)
		{
			var key = this.rowsTableInputPath[i];
			rows = rows[key];
		}

		// prep table
		var tableHtml = '<table id="'+this.rowsTableId+'" class="editable shadow-box">' +
			 '<thead>' +
				 '<tr>';

		// re-do columns of rowsTable
		for (var colId in columns)
		{
			// force type of col to be textual
			columns[colId].type = 'singleline';
			tableHtml += '<th scope="col" class="header">'+(columns[colId].heading ? columns[colId].heading : '&nbsp;')+'</th>';
		}

		tableHtml += '<th class="header" colspan="2"></th>' +
				 '</tr>' +
			 '</thead>' +
			 '<tbody>';

		// merge in the current rows content
		for (var rowId in rows)
		{
			tableHtml += Craft.EditableTable.getRowHtml(rowId, columns, this.rowsTableName, rows[rowId]);
		}

		tableHtml += '</tbody>' +
			'</table>';

		this.rowsTable.$table.replaceWith(tableHtml);
		this.rowsTable.destroy();
		delete this.rowsTable;
		this.initRowsTable(columns);


	},

	makeDataBlob: function()
	{
		console.log('make data blob');
	}

});


})(jQuery);
